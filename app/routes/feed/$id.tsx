import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import type { Queue, Song, User } from "@prisma/client";
import { UserIcon } from "@heroicons/react/24/solid";
import { requireUserId } from "~/session.server";
import { classNames } from "~/utils";

type LoaderData = {
  userId: string;
  queue: Queue & { songs: Song[]; author: User };
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  const queue = await prisma.queue.findUnique({
    where: { id },
    include: { songs: true, author: true },
  });

  if (!queue) throw "Hey";

  return json<LoaderData>({ userId, queue });
};

export default function SpecificQueue() {
  const navigate = useNavigate();
  const onDismiss = () => navigate("../");

  const { queue } = useLoaderData<LoaderData>();

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onDismiss}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-50  transition-all" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute bottom-0 left-0 -ml-8 flex pt-4 pr-2 sm:top-0 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={onDismiss}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-zinc-800 p-8">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="text-lg font-medium text-gray-300">
                              <span className="sr-only">Details for </span>
                              {queue.title}
                            </h2>
                            <p className="text-sm font-medium text-gray-400">
                              {queue.songs.length} songs.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <HeartIcon className="h-6 w-6" aria-hidden="true" />
                            <span className="sr-only">Favorite</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="mt-2 flex items-center justify-between text-gray-300">
                          {queue.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-300">
                          Shared by
                        </h3>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-700 border-t border-gray-600"
                        >
                          <li className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                              <UserIcon className="h-6 w-6 text-emerald-400" />
                              <p className="ml-4 text-sm font-medium text-gray-400">
                                {queue.author.email}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="flex">
                        <Form action="/api/export-queue" method="post">
                          <input
                            hidden
                            name="queueId"
                            value={queue.id}
                            readOnly
                          />
                          <button
                            type="submit"
                            className={classNames(
                              "flex-1 rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                              queue.songs.length === 0
                                ? "bg-gray-600"
                                : "bg-emerald-600"
                            )}
                            disabled={queue.songs.length === 0}
                          >
                            {queue.songs.length === 0
                              ? "Can't export yet - no songs"
                              : "Export"}
                          </button>
                        </Form>
                      </div>
                      <div>
                        {queue.songs.length > 0 && (
                          <>
                            <h3 className="font-medium text-gray-300">Songs</h3>
                            <ul
                              role="list"
                              className="mt-2 divide-y divide-gray-700 border-t border-b border-gray-700"
                            >
                              {queue.songs.map((s: Song) => {
                                return (
                                  <li
                                    className="flex items-center justify-between py-3"
                                    key={s.id}
                                  >
                                    <div className="flex items-center">
                                      <p className="ml-4 text-sm font-medium text-gray-300">
                                        {s.name} - {s.artist}
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
