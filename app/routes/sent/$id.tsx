import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  Link,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { Queue, Song } from "@prisma/client";
import { UserIcon } from "@heroicons/react/24/solid";
import { requireUserId } from "~/session.server";
import { SearchSong } from "~/components/SearchSong";

type LoaderData = {
  userId: string;
  queue: Queue;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  const queue = await prisma.queue.findUnique({
    where: { id },
    include: { songs: true, recipient: true },
  });

  if (!queue) throw "Hey";

  return json<LoaderData>({ userId, queue });
};

export default function SpecificQueue() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onDismiss = () => navigate("../");

  const { userId, queue } = useLoaderData<LoaderData>();
  // const queue = location.state as Queue
  const isOwnQueue = queue.authorId === userId;

  const openSearchInput = () => {
    setIsSearching(!isSearching);
    inputRef.current?.focus();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
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
                      {/*
*
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Information
                        </h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Uploaded by</dt>
                            <dd className="text-gray-900">Marie Culver</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Created</dt>
                            <dd className="text-gray-900">June 8, 2020</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Last modified</dt>
                            <dd className="text-gray-900">June 8, 2020</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Dimensions</dt>
                            <dd className="text-gray-900">4032 x 3024</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Resolution</dt>
                            <dd className="text-gray-900">72 x 72</dd>
                          </div>
                        </dl>
                      </div>
* */}
                      <div>
                        <p className="mt-2 flex items-center justify-between text-gray-300">
                          {queue.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-300">
                          Shared with
                        </h3>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-700 border-t border-gray-600"
                        >
                          {queue.recipient ? (
                            <li className="flex items-center justify-between py-3">
                              <div className="flex items-center">
                                <UserIcon className="h-6 w-6 text-emerald-400" />
                                <p className="ml-4 text-sm font-medium text-gray-400">
                                  {queue?.recipient?.email}
                                </p>
                              </div>
                            </li>
                          ) : (
                            <li className="flex items-center justify-between py-2">
                              <button
                                type="button"
                                className="group -ml-1 flex items-center rounded-md bg-zinc-800 p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-emerald-300 text-gray-400">
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="ml-4 text-sm font-medium text-gray-400 group-hover:text-emerald-500">
                                  Share
                                </span>
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-300">Songs</h3>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-700 border-t border-b border-gray-700"
                        >
                          {isOwnQueue && (
                            <li className="flex w-full items-center justify-between py-2">
                              {!isSearching ? (
                                <button
                                  className="group -ml-1 flex items-center rounded-md bg-zinc-800 p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  onClick={() => openSearchInput()}
                                >
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-emerald-400">
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                  <span className="ml-4 text-sm font-medium text-emerald-400 group-hover:text-emerald-500">
                                    Add a song
                                  </span>
                                </button>
                              ) : (
                                <SearchSong queue_id={queue.id} />
                              )}
                            </li>
                          )}
                          {[...queue.songs].reverse().map((s: Song) => {
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
                      </div>
                      <div className="flex">
                        {!isOwnQueue && (
                          <button
                            type="button"
                            className="flex-1 rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          >
                            Export
                          </button>
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
