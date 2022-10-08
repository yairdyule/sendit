import { Link } from "@remix-run/react";
import { classNames } from "~/utils/css";

export default function SignupSignin() {
  return (
    <main
      className={classNames(
        "flex h-full w-full flex-col items-center justify-center bg-zinc-800"
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          <span className="block">Share music like never before.</span>
          <span className="block">
            Start using <span className="text-emerald-400">SendIt</span> today.
          </span>
        </h2>
        <div className="">
          <Link
            to="/"
            className="flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"
          >
            Proceed with Spotify
          </Link>
        </div>
      </div>
    </main>
  );
}
