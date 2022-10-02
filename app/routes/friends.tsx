import { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireSpotifyAuthCode, requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const spotifyCode = await requireSpotifyAuthCode(request);

  return {};
}

export default function QueuesPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="m-4">
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
