import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import axios from "axios";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const USER_SESSION_KEY = "userId";
export const SPOTIFY_CODE_KEY = "authCode";
export const SPOTIFY_ACCESS_TOKEN = "accessToken";
export const SPOTIFY_REFRESH_TOKEN = "refreshToken";

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
  const access_token = session.get(SPOTIFY_ACCESS_TOKEN).toString();
  const refresh_token = session.get(SPOTIFY_REFRESH_TOKEN).toString();
  return { access_token, refresh_token };
}

export async function getSpotifyCodeFromSession(
  request: Request
): Promise<String | undefined> {
  const session = await getSession(request);
  const spotifyCode = session.get(SPOTIFY_CODE_KEY) as string;
  return spotifyCode;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
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

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireSpotifyAuthCode(request: Request) {
  const spotifyCode = await getSpotifyCodeFromSession(request);
  if (!spotifyCode)
    throw redirect(
      `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fauth&scope=user-read-currently-playing%20user-top-read%20playlist-modify-public%20playlist-modify-private%20user-library-read`
    );
  return spotifyCode;
}

export async function requireSpotifyToken(request: Request) {
  const tokens = await getSpotifyTokenFromSession(request);
  const { access_token } = await refreshAccessToken(
    tokens?.refresh_token || ""
  );
  if (!access_token)
    throw redirect(
      `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fauth&scope=user-read-currently-playing%20user-top-read%20playlist-modify-public%20playlist-modify-private%20user-library-read`
    );
  return access_token as string;
}

export async function refreshAccessToken(refresh: string) {
  const { basic } = getCredentials();
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

export const getCredentials = () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  return { basic, client_id, client_secret };
};

export async function requestSpotifyAccessToken(
  request: Request,
  code: string
) {
  //exchange authorization code for access token
  // const code = (await requireSpotifyAuthCode(request)) as string;
  const { basic, client_secret, client_id } = getCredentials();

  console.log({
    basic,
    client_id,
    client_secret,
    code,
  });

  try {
    const body = new URLSearchParams({
      code: code,
      redirect_uri: "http://localhost:3000/auth",
      grant_type: "authorization_code",
    }).toString();
    console.log(body);
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": `application/x-www-form-urlencoded`,
      },
    });

    const data = await response.json();
    console.log(data);

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
