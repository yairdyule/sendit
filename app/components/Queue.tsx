import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ChevronRightIcon,
  PlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

import type { Queue, User } from "@prisma/client";

dayjs.extend(relativeTime);

export function QueueCard({
  queue,
  author,
}: {
  queue: Queue | any;
  author?: User;
}) {
  const then = dayjs(new Date(queue.updatedAt)).fromNow();
  console.log({ then });
  return (
    <div className="group h-32 max-w-md rounded border-[1px] border-neutral-800 border-opacity-50 bg-card-dark p-5 transition hover:border-emerald-500 hover:bg-card-lighter">
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-gray-300">{queue.title}</h2>
          <ChevronRightIcon className="h-5 w-5 text-gray-400 transition group-hover:text-emerald-500" />
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-sm text-gray-400">{author?.username}</h2>
        </div>
        <div className="flex h-full flex-grow"></div>
        <span className="self-end justify-self-end text-sm text-gray-500 ">
          created {then}
        </span>
      </div>
    </div>
  );
}
// <div className="flex w-full h-32 max-w-md items-center justify-between space-x-6 rounded-md bg-card-dark p-6">
//   <div className="flex-1 truncate">
//     <div className="flex w-72 items-center space-x-3">
//       <h3 className="text-md truncate font-base text-gray-200">
//         {queue.title}
//       </h3>
//       {author && (
//         <h3 className="text-md truncate font-base text-gray-400">
//           {author.username}
//         </h3>
//       )}
//     </div>
//     <span className="inline-block flex-shrink-0 items-center justify-center rounded-full bg-emerald-800 px-2 py-0.5 text-xs  text-zinc-200">
//       {new Date(queue.updatedAt).toLocaleDateString()}
//     </span>
//   </div>
// </div>

export function AddQueueCard() {
  return (
    <div className="group h-32 max-w-md rounded border-[1px] border-neutral-800 border-opacity-50 bg-card-dark p-5 transition hover:border-emerald-500 hover:bg-card-lighter">
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-gray-300">Create a queue</h2>
          <PlusIcon className="h-5 w-5 text-gray-400 transition group-hover:text-emerald-500" />
        </div>
      </div>
    </div>
  );
}
