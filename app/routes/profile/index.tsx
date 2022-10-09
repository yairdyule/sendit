import { prisma } from "~/db.server";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { requireCreatedUser, requireSpotifyUser } from "~/session.server";

import type { LoaderArgs } from "@remix-run/server-runtime";
import type { User } from "@prisma/client";

dayjs.extend(LocalizedFormat);

type LoaderData = {
  user: User;
  sentQueueCount: number;
  gotCount: number;
};
export async function loader({ request }: LoaderArgs) {
  await requireSpotifyUser(request);
  const user = await requireCreatedUser(request);
  const sentQueueCount = await prisma.queue.count({
    where: { authorId: user.id },
  });
  const gotCount = await prisma.queue.count({
    where: {
      recipientIds: {
        has: user.id,
      },
    },
  });

  return json<LoaderData>({ user, sentQueueCount, gotCount });
}

export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <UserHeader />
    </div>
  );
}

const UserHeader = () => {
  const { user, sentQueueCount, gotCount } = useLoaderData<LoaderData>();
  return (
    <header className="flex h-32 w-full flex-col items-start justify-end  bg-card-dark bg-[url('/topography.svg')] px-4 pb-2">
      <h2 className="text-lg font-medium text-neutral-100">{user.username}</h2>
      <div className="flex flex-row items-center gap-4 text-neutral-400">
        <h3 className="text-xs sm:text-sm">Authored {sentQueueCount} queues</h3>
        <h3 className="text-xs sm:text-sm ">Exported {gotCount} queues</h3>
        <h3 className="hidden text-sm sm:block">
          Member since {dayjs(user.createdAt).format("ll")}
        </h3>
      </div>
    </header>
  );
};
