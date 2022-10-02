import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import {
  requireSpotifyAuthCode,
  requireUserId,
  requireSpotifyToken,
} from "~/session.server";
import { prisma } from "~/db.server";
import { AddQueueCard, QueueCard } from "~/components/Queue";
import { Queue } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  await requireSpotifyAuthCode(request);
  const token = await requireSpotifyToken(request);

  console.log(token);

  const queues = await prisma.queue.findMany({
    where: { authorId: userId },
    include: { recipient: true },
  });

  return json({ queues });
}

export default function QueuesPage() {
  const { queues } = useLoaderData<{ queues: Queue[] }>();
  return (
    <div className="m-4 flex flex-col items-center overflow-scroll">
      <h2 className="overflow-scroll text-xl font-medium text-emerald-400">
        Sent Queues
      </h2>
      <div className="overflow-scroll pt-4">
        <div>
          {queues && (
            <ul className="grid max-w-2xl grid-cols-1  gap-6 overflow-scroll sm:grid-cols-2">
              {queues.map((queue) => (
                <Link to={`/sent/${queue.id}`} key={queue.id} state={queue}>
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
