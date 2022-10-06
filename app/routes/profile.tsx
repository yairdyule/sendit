import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireSpotifyUser } from "~/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof requireSpotifyUser>>;
};
export async function loader({ request }: LoaderArgs) {
  const user = await requireSpotifyUser(request);

  return json<LoaderData>({ user });
}

export default function ProfilePage() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="m-4 mx-auto max-w-4xl pt-4">
      <Outlet />
    </div>
  );
}
