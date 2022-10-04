import { redirect } from "@remix-run/server-runtime";
import {
  requireSpotifyAuthCode,
  requireSpotifyToken,
  requireUser,
} from "~/session.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  await requireSpotifyAuthCode(request);
  await requireSpotifyToken(request);

  return redirect("/feed");
};
