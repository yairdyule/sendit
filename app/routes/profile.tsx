import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireSpotifyAuthCode, requireUserId } from "~/session.server";
import Layout from "~/components/Layout";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const spotifyCode = await requireSpotifyAuthCode(request);

  return {};
}

export default function QueuesPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="m-4 pt-4 max-w-4xl mx-auto">
      <Outlet />
    </div>
  );
}
