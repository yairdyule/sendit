import { Link, Outlet } from "@remix-run/react";
import { classNames, useOptionalUser } from "~/utils";

export default function SignupSignin() {
  const user = useOptionalUser();
  return (
    <main
      className={classNames(
        "flex h-full flex-col items-center justify-center ",
        user ? "" : "bg-indigo-700"
      )}
    >
      <Outlet />
    </main>
  );
}
