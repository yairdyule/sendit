import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireSpotifyToken } from "~/session.server";
import { Spotify } from "~/utils/spotify";

import type { ActionFunction } from "@remix-run/server-runtime";

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const token = await requireSpotifyToken(request);

    const user = await Spotify.getUserData({ auth_token: token });

    const fd = await request.formData();
    const queueId = fd.get("queueId")?.toString() || "";

    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { songs: true },
    });

    if (!queue) throw new Error("can't export what doesn't exist");

    const playlist = await Spotify.createPlaylist(
      {
        name: queue?.title || "Made with Sendit",
        description:
          queue?.description + " (assembled (with love) via SendIt.)",
        userId: user.id,
        isPublic: false,
      },
      token
    );

    if (queue?.songs) {
      await Spotify.populatePlaylist(
        {
          playlistId: playlist.id,
          trackUris: queue?.songs.map((s) => s.spotify_uri) || [],
        },
        token
      );
    }
    return redirect("/feed");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
