import { prisma } from "~/db.server";
import { Spotify } from "~/utils/spotify.server";

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
      recipientIds: [sentTo],
      description,
      exported_yet: false,
    },
  });
}

type exportParams = {
  queueId: string;
  userId: string;
};
