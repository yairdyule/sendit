import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserBySpotifyId(id: User["spotify_id"]) {
  return prisma.user.findUnique({ where: { spotify_id: id } });
}

export async function createUser({
  spotify_uri,
  spotify_id,
  username,
}: Pick<User, "spotify_id" | "username" | "spotify_uri">) {
  return prisma.user.create({
    data: {
      spotify_uri,
      username,
      spotify_id,
    },
  });
}
