import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import axios from "axios";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserBySpotifyId } from "~/models/user.server";
import { prisma } from "./db.server";
import { Spotify } from "./utils/spotify";

export const USER_SESSION_KEY = "userId";
export const SPOTIFY_AUTH_CODE_KEY = "authCode";
export const SPOTIFY_ACCESS_TOKEN_KEY = "accessToken";
export const SPOTIFY_REFRESH_TOKEN_KEY = "refreshToken";
export const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const REQUIRED_SCOPES =
  "user-read-currently-playing user-top-read playlist-modify-public playlist-modify-private user-library-read";
const env = {
  SESSION_SECRET: process.env.SESSION_SECRET || "",
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.REDIRECT_URI || "",
};

Object.entries(env).forEach(([k, v]) =>
  invariant(v !== "", `${k} must be set.`)
);

const basic = Buffer.from(
  `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

export const getCredentials = () => ({ basic });

const redirectParams = new URLSearchParams({
  response_type: "code",
  scope: REQUIRED_SCOPES,
  client_id: env.SPOTIFY_CLIENT_ID,
  redirect_uri: env.REDIRECT_URI,
  show_dialog: process.env.NODE_ENV === "development" ? "true" : "false",
});

const authUrl = new URL(
  `https://accounts.spotify.com/authorize?${redirectParams.toString()}`
);

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

type Tokens = {
  access_token: string;
  refresh_token: string;
};
export async function getSpotifyTokenFromSession(
  request: Request
): Promise<Tokens | undefined> {
  const session = await getSession(request);
  const access_token = session.get(SPOTIFY_ACCESS_TOKEN_KEY).toString();
  const refresh_token = session.get(SPOTIFY_REFRESH_TOKEN_KEY).toString();
  return { access_token, refresh_token };
}

export async function getSpotifyCodeFromSession(
  request: Request
): Promise<String | undefined> {
  const session = await getSession(request);
  const spotifyCode = session.get(SPOTIFY_AUTH_CODE_KEY) as string;
  return spotifyCode;
}

export async function requireCreatedUser(request: Request) {
  const user = await requireSpotifyUser(request);
  const extantUser = await prisma.user.findUnique({
    where: {
      spotify_id: user.id,
    },
  });

  if (extantUser) {
    return extantUser;
  }

  return await prisma.user.create({
    data: {
      spotify_id: user.id,
      spotify_uri: user.uri,
      username: user.display_name,
    },
  });
}

export async function requireSpotifyUser(request: Request) {
  await requireSpotifyAuthCode(request);
  const token = await requireSpotifyToken(request);
  const user = await Spotify.getUserData({ auth_token: token });
  return user;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/signin-signup`);
  }
  return userId;
}

export async function requireSpotifyAuthCode(request: Request) {
  const spotifyCode = await getSpotifyCodeFromSession(request);
  if (!spotifyCode) throw redirect(authUrl.toString());
  return spotifyCode;
}

export async function requireSpotifyToken(request: Request) {
  const tokens = await getSpotifyTokenFromSession(request);
  const { access_token } = await refreshAccessToken(
    tokens?.refresh_token || ""
  );
  if (!access_token) throw redirect(authUrl.toString());
  return access_token as string;
}

export async function refreshAccessToken(refresh: string) {
  const body = new URLSearchParams({
    refresh_token: refresh,
    grant_type: "refresh_token",
  }).toString();
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": `application/x-www-form-urlencoded`,
    },
    body: body,
  });
  const data = await response.json();
  const { access_token, refresh_token } = data;
  return { access_token, refresh_token };
}

export async function requestSpotifyAccessToken(
  request: Request,
  code: string
) {
  try {
    const body = new URLSearchParams({
      code: code,
      redirect_uri: env.REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString();
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": `application/x-www-form-urlencoded`,
      },
    });

    const data = await response.json();

    const { access_token, refresh_token, expires_in } = data;
    return { access_token, refresh_token, expires_in };
  } catch (err) {
    throw err;
  }
}

export async function createSpotifySession({
  session,
  authorizationCode,
  redirectTo,
}: {
  session: Session;
  authorizationCode: string;
  redirectTo: string;
}) {
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
      Authorization: `Bearer ${authorizationCode}`,
      "Content-Type": `application/json`,
    },
  });
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
