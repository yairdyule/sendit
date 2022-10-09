import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { BiLoaderCircle, BiSearch } from "react-icons/bi";
import { useFetcher } from "@remix-run/react";
import type { SpotifyTrack } from "~/utils/spotify.server";
import { classNames } from "~/utils/css";

export const SearchSong = ({ queue_id }: { queue_id: string }) => {
  const [selectedPerson, setSelectedPerson] = useState();
  const songs = useFetcher<{ songs: SpotifyTrack[] }>();
  const addSong = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef) inputRef?.current?.focus();
  }, [inputRef]);

  return (
    <songs.Form method="get" action="/api/search" className="w-full">
      <Combobox
        as="div"
        value={selectedPerson}
        onChange={setSelectedPerson}
        className="w-full"
      >
        <div className="relative mt-1 w-full">
          <Combobox.Input
            autoComplete="off"
            className="w-full rounded-md border border-gray-300 bg-zinc-800 py-2 pl-3 pr-10 text-emerald-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
            displayValue={(s: SpotifyTrack) => s?.name ?? ""}
            onChange={(e) => {
              songs.submit(e.target.form);
            }}
            ref={inputRef}
            name="query"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            {songs.state === "submitting" ? (
              <BiLoaderCircle className="animate animate-spin" />
            ) : (
              <BiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </Combobox.Button>

          {songs.data && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {songs.data.songs.map((song) => {
                const handler = () => {
                  addSong.submit(
                    {
                      songUri: song.uri,
                      queueId: queue_id,
                      songName: song.name,
                      songArtists: song.artists.map((a) => a.name).join(", "),
                    },
                    { action: "/api/add-song-to-queue", method: "post" }
                  );
                };
                return (
                  <Combobox.Option
                    key={song.uri}
                    value={song.uri}
                    onSelect={handler}
                    onClick={handler}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-emerald-700 text-white" : "text-gray-900"
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <div className="flex">
                          <span
                            className={classNames(
                              "truncate text-gray-400",
                              active
                                ? "font-semibold text-white"
                                : "text-gray-400"
                            )}
                          >
                            {song.name}
                          </span>
                          <span
                            className={classNames(
                              "ml-2 truncate text-gray-500",
                              active ? "text-white" : "text-gray-400"
                            )}
                          >
                            {song.artists.map((a) => a.name).join(",")}
                          </span>
                        </div>

                        {selected && (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              active ? "text-gray-100" : "text-emerald-400"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </songs.Form>
  );
};
