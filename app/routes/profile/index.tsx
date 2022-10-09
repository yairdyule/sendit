import { prisma } from "~/db.server";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { requireCreatedUser, requireSpotifyUser } from "~/session.server";

import type { LoaderArgs } from "@remix-run/server-runtime";
import type { User } from "@prisma/client";
import { Popover, Transition } from "@headlessui/react";
import { classNames } from "~/utils/css";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

dayjs.extend(LocalizedFormat);

type LoaderData = {
  user: User;
  sentQueueCount: number;
  gotCount: number;
};
export async function loader({ request }: LoaderArgs) {
  await requireSpotifyUser(request);
  const user = await requireCreatedUser(request);
  const sentQueueCount = await prisma.queue.count({
    where: { authorId: user.id },
  });
  const gotCount = await prisma.queue.count({
    where: {
      recipientIds: {
        has: user.id,
      },
    },
  });

  return json<LoaderData>({ user, sentQueueCount, gotCount });
}

export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <UserHeader />
    </div>
  );
}

const UserHeader = () => {
  const { user, sentQueueCount, gotCount } = useLoaderData<LoaderData>();
  return (
    <header className="flex h-32 w-full flex-col items-start justify-end bg-card-dark  bg-[url('/topography.svg')] px-4 pb-2 lg:h-48 lg:pb-4">
      <h2 className="text-lg font-medium text-neutral-100 lg:text-xl">
        {user.username}
      </h2>
      <div className="flex max-w-lg flex-row items-center gap-4 text-neutral-400">
        <h3 className="text-xs sm:text-sm">Authored {sentQueueCount} queues</h3>
        <h3 className="text-xs sm:text-sm ">Exported {gotCount} queues</h3>
        <h3 className="hidden text-sm sm:block">
          Member since {dayjs(user.createdAt).format("ll")}
        </h3>
        <ProfileMenu />
      </div>
    </header>
  );
};

const ProfileMenu = () => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? "text-neutral-500" : "text-neutral-400",
              "group inline-flex items-center rounded-md bg-neutral-700 px-2 py-1 text-sm font-medium hover:text-gray-300 focus:outline-none "
            )}
          >
            <span>Settings</span>
            <ChevronDownIcon
              className={classNames(
                open ? "text-neutral-300" : "text-gray-400",
                "ml-2 h-5 w-5 group-hover:text-gray-500"
              )}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-36 max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-neutral-700 px-5 py-2 sm:gap-8">
                  <form action="/logout" method="post">
                    <button
                      className="-m-3 block rounded-md p-3 transition duration-150 ease-in-out"
                      type="submit"
                    >
                      <p className="text-sm font-medium text-neutral-400">
                        Log out
                      </p>
                    </button>
                  </form>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
