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
    <div className="m-4 flex flex-col overflow-auto">
      <h2 className="font-base overflow-auto text-xl text-emerald-400">
        Created
      </h2>
      <div
        className={classNames(
          "grid w-full grid-cols-1 gap-4 overflow-auto pt-4 md:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {queues && (
          <>
            {queues.map((queue) => (
              <Link to={`${queue.id}`} key={queue.id} state={queue}>
                <QueueCard queue={queue} key={queue.id} />
              </Link>
            ))}
            <Link to={"add"}>
              <AddQueueCard />
            </Link>
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
}
