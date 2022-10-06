import { redirect } from "@remix-run/server-runtime";
import { requireSpotifyUser } from "~/session.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  await requireSpotifyUser(request);

  return redirect("/feed");
};
