import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireSpotifyUser } from "~/session.server";

import type { ActionFunction } from "@remix-run/server-runtime";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireSpotifyUser(request);
  const fd = await request.formData();
  const title = fd.get("title")?.toString() ?? "";
  const description = fd.get("description")?.toString() ?? "";

  await prisma.queue.create({
    data: {
      title,
      description,
      exported_yet: false,
      author: {
        connectOrCreate: {
          where: {
            spotify_id: user.id,
          },
          create: {
            username: user.display_name,
            spotify_id: user.id,
            spotify_uri: user.uri,
          },
        },
      },
    },
  });
  return redirect("/created");
};

export default function AddPage() {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const handleDismiss = () => navigate("/created");

  // const isMobile = window.innerWidth <= 768;
  const isMobile = true;

  const cancelButtonRef = useRef(null);

  return (
    <>
      {isMobile ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 h-full"
            initialFocus={cancelButtonRef}
            onClose={handleDismiss}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-zinc-900 bg-opacity-50  transition-all" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 h-full overflow-y-auto">
              <div className="flex min-h-full w-full items-start justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-zinc-800 bg-opacity-100 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 md:max-w-xl">
                    <AddForm />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleDismiss}>
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                      <div className="flex h-full flex-col overflow-y-scroll bg-zinc-800 py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                              Panel title
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md bg-zinc-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          {/* Replace with your content */}
                          <div className="absolute inset-0 px-4 sm:px-6">
                            <div
                              className="h-full border-2 border-dashed border-gray-200"
                              aria-hidden="true"
                            />
                          </div>
                          {/* /End replace */}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
}

function AddForm() {
  return (
    <div className="h-full md:grid md:grid-cols-1 md:gap-2">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-300">
            Create a Queue
          </h3>
          <p className="mt-1 text-sm text-gray-400">Add songs to it later.</p>
        </div>
      </div>
      <div className="mt-5 md:col-span-2 md:mt-0">
        <Form method="post">
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm">
                    <label
                      htmlFor="title"
                      className="absolute -top-2 left-2 -mt-px inline-block bg-zinc-800 px-1 text-xs font-medium text-gray-400"
                    >
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      name="title"
                      id="title"
                      className="block w-full border-0 bg-inherit text-gray-300"
                      placeholder="Songs for a friend"
                    />
                  </div>
                </div>
              </div>

              <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm ">
                <label
                  htmlFor="title"
                  className="absolute -top-2 left-2 -mt-px inline-block bg-zinc-800 px-1 text-xs font-medium text-gray-400"
                >
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  id="description"
                  className="block w-full border-0 bg-inherit p-0 text-gray-300 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Enter a description"
                />
              </div>
              <div className="w-full divide-slate-500 py-2" />
            </div>
            <div className="px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="focus:ribg-emerald-500 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
