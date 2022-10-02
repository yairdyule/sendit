import { ActionFunction } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);

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
