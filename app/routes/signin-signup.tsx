import { Link, Outlet } from "@remix-run/react";
import { classNames, useOptionalUser } from "~/utils";

export default function SignupSignin() {
  const user = useOptionalUser();
  return (
    <main
      className={classNames(
        "flex h-full w-full flex-col items-center justify-center bg-zinc-800"
      )}
    >
      <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Share music like never before.</span>
          <span className="block">
            Start using <span className="text-emerald-400">SendIt</span> today.
          </span>
        </h2>
        <div className="space-y-4 pt-2 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Link
            to="/join"
            className="text-emerald-500-700 flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium shadow-sm hover:bg-indigo-50 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
