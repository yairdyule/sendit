import { prisma } from "~/db.server";
import { Spotify } from "~/utils/spotify";

import type { User, Queue } from "@prisma/client";
export type { Queue } from "@prisma/client";

type CreateQueueParams = {
  sentBy: string;
  sentTo: string;
  title: Queue["title"];
  description: Queue["description"];
};
export function createQueue({
  sentBy,
  sentTo,
  title,
  description,
}: CreateQueueParams) {
  return prisma.queue.create({
    data: {
      title,
      authorId: sentBy,
      recipientId: sentTo,
      description,
      exported_yet: false,
    },
  });
}

type exportParams = {
  queueId: string;
  userId: string;
};

//get queue info from db {title, description, songIdArray}
//create playlist {title, description}
//populate it with songs from songIdArray
export async function exportQueue({ queueId, userId }: exportParams) {
  const queue = await prisma.queue.findFirst({
    where: { id: queueId, OR: { recipientId: userId, authorId: userId } },
    include: {
      songs: true,
    },
  });

  const createdPlaylist = await Spotify.createPlaylist({
    isPublic: true,
    userId: userId,
    description: queue?.description,
    name: queue?.title || "A playlist",
  });

  await Spotify.populatePlaylist({
    playlistId: createdPlaylist.id,
    trackUris: queue?.songs.map((s) => s.id) || [],
  });
}

export async function getUserQueues({ userId }: { userId: User["id"] }) {
  const sentQueues = await prisma.queue.findMany({
    where: { authorId: userId },
  });
  const receivedQueues = await prisma.queue.findMany({
    where: { recipientId: userId },
  });

  return { sentQueues, receivedQueues };
}

export function getUserSentQueues() {}
