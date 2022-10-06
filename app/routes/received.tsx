import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireSpotifyUser } from "~/session.server";
import { prisma } from "~/db.server";
import { QueueCard } from "~/components/Queue";
import type { Queue, User } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const user = await requireSpotifyUser(request);

  const queues = await prisma.queue.findMany({
    where: { recipientId: user.id },
    include: {
      author: true,
    },
  });

  return json({ queues });
}

export default function QueuesPage() {
  const { queues } = useLoaderData<{ queues: (Queue & { author: User })[] }>();
  return (
    <div className="m-4">
      <h2 className="text-xl font-medium text-emerald-400">Received Queues</h2>
      <div className="pt-4">
        <div>
          {queues && (
            <ul className="grid grid-cols-1 gap-6  sm:grid-cols-2 lg:grid-cols-3">
              {queues.map((queue) => (
                <Link to={`/received/${queue.id}`} key={queue.id} state={queue}>
                  <QueueCard queue={queue} key={queue.id} />
                </Link>
              ))}
            </ul>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
