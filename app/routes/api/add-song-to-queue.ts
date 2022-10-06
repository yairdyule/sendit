import { prisma } from "~/db.server";
import { requireSpotifyUser } from "~/session.server";

import type { ActionFunction } from "@remix-run/server-runtime";

export const action: ActionFunction = async ({ request, params }) => {
  await requireSpotifyUser(request);

  const fd = await request.formData();
  const songUri = fd.get("songUri")?.toString();
  const queueId = fd.get("queueId")?.toString();
  const songName = fd.get("songName")?.toString();
  const songArtists = fd.get("songArtists")?.toString();

  if (!songUri || !songName || !songArtists || !queueId) throw "bro";

  const queue = await prisma.queue.findUnique({ where: { id: queueId } });

  if (!queue) return;

  try {
    await prisma.song.create({
      data: {
        id: songUri,
        name: songName,
        artist: songArtists,
        spotify_uri: songUri,
        queue: {
          connect: {
            id: queueId,
          },
        },
      },
    });
    return { message: "way to go man" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
