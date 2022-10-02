import type { LoaderArgs } from "@remix-run/server-runtime";
import { type LoaderFunction, redirect } from "@remix-run/server-runtime";
import {
  createSpotifySession,
  getSession,
  requestSpotifyAccessToken,
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_CODE_KEY,
  SPOTIFY_REFRESH_TOKEN,
} from "~/session.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const spotifyCode = searchParams.get("code");
  const error = searchParams.get("error");

  const session = await getSession(request);
  session.set(SPOTIFY_CODE_KEY, spotifyCode);

  const { access_token, refresh_token, expires_in } = await requestSpotifyAccessToken(
    request,
    spotifyCode ?? ""
  );

  session.set(SPOTIFY_ACCESS_TOKEN, access_token);
  session.set(SPOTIFY_REFRESH_TOKEN, refresh_token);
  session.set("expiresIn", expires_in);

  if (spotifyCode) {
    return createSpotifySession({
      session,
      authorizationCode: spotifyCode,
      redirectTo: "/",
    });
  } else if (error) {
    console.log("auth errorr or unauthed for scopes");
  }
  return redirect("/");
};
