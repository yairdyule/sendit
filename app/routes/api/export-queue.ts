import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireSpotifyToken, requireUser } from "~/session.server";
import { Spotify } from "~/utils/spotify";

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const token = await requireSpotifyToken(request);

    const user = await Spotify.getUserData({ auth_token: token });

    const { id } = await requireUser(request);

    const fd = await request.formData();
    const queueId = fd.get("queueId")?.toString() || "";
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: { songs: true },
    });

    const playlist = await Spotify.createPlaylist(
      {
        name: queue?.title || "Made with Sendit",
        description: queue?.description,
        userId: user.id,
        isPublic: false,
      },
      token
    );

    await Spotify.populatePlaylist(
      {
        playlistId: playlist.id,
        trackUris: queue?.songs.map((s) => s.spotify_uri) || [],
      },
      token
    );
  } catch (error) {
    throw error;
  }
  return redirect("/received");
};
