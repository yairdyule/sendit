import { prisma } from "~/db.server";
import { json } from "@remix-run/server-runtime";
import { Details, UserHeader } from "~/components/Profile";
import { requireCreatedUser, requireSpotifyUser } from "~/session.server";

import type { LoaderArgs } from "@remix-run/server-runtime";
import type { Queue, User } from "@prisma/client";

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
    sentQueues: sentQueues.sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
    ),
    sentQueueCount: sentQueues.length,
    gotCount,
  });
}

export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <UserHeader />
      <Details />
    </div>
  );
}
