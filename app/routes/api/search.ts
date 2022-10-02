import { json } from "@remix-run/server-runtime";
import { requireSpotifyToken } from "~/session.server";
import { Spotify } from "~/utils/spotify";

import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const code = await requireSpotifyToken(request);
  if (!query) return json({ songs: [] });

  const items = await Spotify.search({ query });

  return json({
    songs: items.map(({ name, uri, artists }) => ({ name, uri, artists })),
  });
};
