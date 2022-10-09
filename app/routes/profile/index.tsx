import { prisma } from "~/db.server";
import { json } from "@remix-run/server-runtime";
import { Details, UserHeader } from "~/components/Profile";
import { requireCreatedUser, requireSpotifyUser } from "~/session.server";

import type { LoaderArgs } from "@remix-run/server-runtime";
import type { Queue, User } from "@prisma/client";
import Layout from "~/components/Layout";

export type ProfileData = {
  user: User;
  sentQueues: Queue[];
  sentQueueCount: number;
  gotCount: number;
};

export async function loader({ request }: LoaderArgs) {
  await requireSpotifyUser(request);
  const user = await requireCreatedUser(request);
  const sentQueues = await prisma.queue.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const gotCount = await prisma.queue.count({
    where: {
      recipientIds: {
        has: user.id,
      },
    },
  });

  return json<ProfileData>({
    user,
    sentQueues,
    sentQueueCount: sentQueues.length,
    gotCount,
  });
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <UserHeader />
      <Details />
    </div>
  );
}
