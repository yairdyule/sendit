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
  const user = await requireSpotifyUser(request);

  const queues = await prisma.queue.findMany({
    take: 20,
    include: { author: true },
  });
  return json({ queues });
};

export default function Homepage() {
  const { queues } = useLoaderData<LoaderData>();

  return (
    <Layout>
      <Wrapper>
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
      </Wrapper>
      <Outlet />
    </Layout>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 pt-4">
    {children}
  </div>
);

export const ErrorBoundary = ({ error }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/feed");
    }, 3500);
  }, [navigate]);
  return (
    <Layout>
      <>
        <Wrapper>
          <>
            <h2 className="overflow-scroll text-xl font-medium text-red-400">
              Oops!
            </h2>
            <div className="flex flex-col gap-4 overflow-scroll text-gray-300">
              Something went wrong on our end.
              {error.toString()}
            </div>
          </>
        </Wrapper>
      </>
    </Layout>
  );
};
