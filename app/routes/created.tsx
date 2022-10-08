import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireSpotifyUser } from "~/session.server";
import { prisma } from "~/db.server";
import { AddQueueCard, QueueCard } from "~/components/Queue";

import type { LoaderArgs } from "@remix-run/node";
import type { Queue } from "@prisma/client";
import { breakpoints, classNames } from "~/utils/css";

export async function loader({ request }: LoaderArgs) {
  const user = await requireSpotifyUser(request);

  const queues = await prisma.queue.findMany({
    where: {
      author: {
        spotify_id: user.id,
      },
    },
  });

  return json({ queues });
}

export default function QueuesPage() {
  const { queues } = useLoaderData<{ queues: Queue[] }>();
  return (
    <div className="m-4 mx-auto flex flex-col overflow-auto lg:px-20 px-4">
      <h2 className="overflow-auto text-xl font-medium text-gray-300">
        Created Queues
      </h2>
      <div className="overflow-auto pt-4">
        <div>
          {queues && (
            <ul className="grid max-w-2xl grid-cols-1  gap-4 overflow-scroll sm:grid-cols-2">
              {queues.map((queue) => (
                <Link to={`${queue.id}`} key={queue.id} state={queue}>
                  <QueueCard queue={queue} key={queue.id} />
                </Link>
              ))}
              <AddQueueCard />
            </ul>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
