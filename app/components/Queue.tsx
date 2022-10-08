import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ChevronRightIcon,
  PlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";

import type { Queue, User } from "@prisma/client";
import { ReactNode } from "react";

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
    <BaseCard>
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-sm text-gray-300 md:text-base">{queue.title}</h2>
        <ChevronRightIcon className="h-5 w-5 text-gray-400 transition group-hover:text-emerald-500" />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-sm text-gray-400">{author?.username}</h2>
      </div>
      <div className="flex h-full flex-grow"></div>
      <span className="self-end justify-self-end text-xs text-gray-500 sm:text-sm ">
        created {then}
      </span>
    </BaseCard>
  );
}

export function AddQueueCard() {
  return (
    <BaseCard>
      <div className="flex w-full flex-row items-center justify-between">
        <h2 className="text-sm text-gray-300 md:text-base">Create a queue</h2>
        <PlusIcon className="h-5 w-5 text-gray-400 transition group-hover:text-emerald-500" />
      </div>
    </BaseCard>
  );
}

const BaseCard = ({ children }: { children: ReactNode }) => (
  <div className="group h-24 max-w-md rounded border-[1px] border-neutral-800 border-opacity-50 bg-card-dark p-5 transition hover:border-emerald-500 hover:bg-card-lighter sm:h-32">
    <div className="flex h-full w-full flex-col">{children}</div>
  </div>
);
