import { json } from "@remix-run/server-runtime";
import { requireSpotifyUser } from "~/session.server";
import { prisma } from "~/db.server";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { QueueCard } from "~/components/Queue";
import { useEffect } from "react";

import type { LoaderFunction } from "@remix-run/server-runtime";
import type { Queue, User } from "@prisma/client";

type LoaderData = { queues: (Queue & { author: User })[] };
export const loader: LoaderFunction = async ({ request }) => {
  await requireSpotifyUser(request);

  const queues = await prisma.queue.findMany({
    take: 20,
    include: { author: true },
  });
  return json({ queues });
};

export default function Homepage() {
  const { queues } = useLoaderData<LoaderData>();

  return (
    <div className="m-4 mx-auto flex flex-col overflow-auto px-4 lg:px-20">
      <h2 className="overflow-auto text-xl font-medium text-emerald-400">
        Feed
      </h2>
      <div className="flex flex-col gap-4 overflow-auto pt-4">
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

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="m-4 mx-auto flex flex-col overflow-auto px-4 lg:px-20">
    {children}
  </div>
);

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/feed");
    }, 3500);
  }, [navigate]);
  return (
    <>
      <h2 className="overflow-scroll text-xl font-medium text-red-400">
        Oops!
      </h2>
      <div className="flex flex-col gap-4 overflow-scroll text-gray-300">
        Something went wrong on our end.
        {error.toString()}
      </div>
    </>
  );
};
