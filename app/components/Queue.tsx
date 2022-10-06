import { SquaresPlusIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

import type { Queue, User } from "@prisma/client";

export function QueueCard({
  queue,
  author,
}: {
  queue: Queue | any;
  author?: User;
}) {
  return (
    <div className="flex w-full max-w-xl items-center justify-between space-x-6 rounded-md bg-card-dark p-6">
      <div className="flex-1 truncate">
        <div className="flex w-72 items-center space-x-3">
          <h3 className="text-md truncate font-medium text-gray-200">
            {queue.title}
          </h3>
          {author && (
            <h3 className="text-md truncate font-medium text-gray-400">
              {author.username}
            </h3>
          )}
        </div>
        <span className="inline-block flex-shrink-0 items-center justify-center rounded-full bg-emerald-800 px-2 py-0.5 text-xs  text-zinc-200">
          {new Date(queue.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export function AddQueueCard() {
  return (
    <div className="sticky bottom-0 col-span-1 divide-y divide-gray-200 rounded-lg bg-zinc-800 shadow-sm shadow-zinc-900 transition-all">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <Link
            className="flex flex-col items-start justify-center gap-1"
            to="/created/add"
          >
            <h3 className="text-md inline-flex items-center truncate font-medium text-gray-400 ">
              Create a queue{" "}
            </h3>
            <SquaresPlusIcon className="h-6 w-6 text-gray-700" />
          </Link>
        </div>
      </div>
    </div>
  );
}
