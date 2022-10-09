import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useLoaderData } from "@remix-run/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Popover, Transition } from "@headlessui/react";
import { classNames } from "~/utils/css";
import { Fragment } from "react";

import type { ProfileData } from "~/routes/profile/index";
import Layout from "../Layout";

dayjs.extend(LocalizedFormat);

export const UserHeader = () => {
  const { user, sentQueueCount, gotCount } = useLoaderData<ProfileData>();
  return (
    <header className="flex h-32 w-full flex-col items-start justify-end gap-1  bg-card-dark bg-[url('/topography.svg')] px-4 pb-2 lg:h-48 lg:pb-4">
      <div className="flex flex-row items-center justify-center">
        <h2 className="text-xl font-medium text-neutral-100 lg:text-4xl">
          {user.username}
        </h2>
        <ProfileMenu />
      </div>
      <h3 className="lg:text-md pt-1 text-xs text-neutral-300">
        Member since {dayjs(user.createdAt).format("ll")}
      </h3>
      <div className="flex w-full flex-row items-center gap-4 text-neutral-400">
        <h3 className="sm:text-md text-xs">Authored {sentQueueCount} queues</h3>
        <h3 className="sm:text-md text-xs ">Exported {gotCount} queues</h3>
      </div>
    </header>
  );
};

export const ProfileMenu = () => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? "text-neutral-500" : "text-neutral-400",
              "group inline-flex items-center rounded-md pt-1 text-sm font-medium hover:text-gray-300 focus:outline-none "
            )}
          >
            <Cog6ToothIcon
              className={classNames(
                open ? "text-neutral-400" : "text-neutral-500",
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

export const Details = () => {
  const { sentQueues } = useLoaderData<ProfileData>();

  return (
    <div className="overflow-scroll p-2">
      <h2 className="text-neutral-300 lg:text-lg">Sent Queues</h2>
      <div className="grid grid-flow-row grid-cols-2 gap-2 overflow-scroll sm:grid-cols-2 lg:grid-cols-4">
        {sentQueues.map((q) => (
          <div
            className="h-48 cursor-not-allowed rounded-md bg-card-dark px-3 py-4"
            key={q.id}
          >
            <div className="flex h-full w-full flex-col justify-end overflow-scroll">
              <h4 className="text-sm text-neutral-300">{q.title}</h4>
              <h4 className="text-xs text-neutral-400">
                {dayjs(q.createdAt).format("ll")}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
