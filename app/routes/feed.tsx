import { json } from "@remix-run/server-runtime";
import { requireSpotifyUser } from "~/session.server";
import { prisma } from "~/db.server";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { QueueCard } from "~/components/Queue";
import { useEffect } from "react";

import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Queue, User } from "@prisma/client";
import { breakpoints, classNames } from "~/utils/css";

type LoaderData = { queues: (Queue & { author: User })[] };
export const loader: LoaderFunction = async ({ request }) => {
  await requireSpotifyUser(request);

  const queues = await prisma.queue.findMany({
    take: 20,
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  return json({ queues });
};

export default function Feed() {
  const { queues } = useLoaderData<LoaderData>();

  return (
    <div className="m-2 flex flex-col overflow-auto sm:m-4">
      <h2 className="font-base overflow-auto text-xl text-emerald-400">Feed</h2>
      <div
        className={classNames(
          "grid w-full grid-cols-2 gap-2 overflow-auto  pt-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {queues &&
          queues.map((q) => (
            <Link to={q.id} key={q.id}>
              <QueueCard queue={q} author={q.author as any} />
            </Link>
          ))}
      </div>
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <div className="container mx-auto">
      <div className="container m-4 mx-auto flex max-w-3xl flex-col overflow-auto px-4">
        <h2 className="font-base overflow-auto text-xl text-red-400">Oops!</h2>
        <p className="text-gray-200">Something seems to have gone wrong.</p>
        <pre className="pt-2 text-sm text-red-300">{error.message}</pre>
      </div>
    </div>
  );
};
