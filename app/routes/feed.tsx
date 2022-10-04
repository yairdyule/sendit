import { json, redirect } from "@remix-run/server-runtime";
import {
  requireSpotifyAuthCode,
  requireSpotifyToken,
  requireUser,
} from "~/session.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { Queue, User } from "@prisma/client";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { QueueCard } from "~/components/Queue";

type LoaderData = { queues: (Queue & { author: User })[] };
export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  await requireSpotifyAuthCode(request);
  await requireSpotifyToken(request);

  const queues = await prisma.queue.findMany({
    take: 20,
    orderBy: { updatedAt: "asc" },
    include: { author: true },
  });
  return json({ queues });
};

export default function Homepage() {
  const { queues } = useLoaderData<LoaderData>();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 pt-4">
        <h2 className="overflow-scroll text-xl font-medium text-emerald-400">
          Feed
        </h2>
        <div className="flex flex-col gap-4 overflow-scroll pt-4">
          {queues &&
            queues.map((q) => (
              <Link to={q.id} key={q.id}>
                <QueueCard queue={q} author={q.author} />
              </Link>
            ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
