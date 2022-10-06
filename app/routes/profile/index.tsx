import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { requireCreatedUser, requireSpotifyUser } from "~/session.server";

import type { LoaderArgs } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { User } from "@prisma/client";

type LoaderData = {
  user: User;
  sentCount: number;
  gotCount: number;
};
export async function loader({ request }: LoaderArgs) {
  await requireSpotifyUser(request);
  const user = await requireCreatedUser(request);
  const sentCount = await prisma.queue.count({ where: { authorId: user.id } });
  const gotCount = await prisma.queue.count({
    where: {
      recipientIds: {
        has: user.id,
      },
    },
  });

  return json<LoaderData>({ user, sentCount, gotCount });
}

export default function ProfilePage() {
  const { user, gotCount, sentCount } = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto flex h-full max-w-md flex-col gap-4">
      <h2 className="text-lg font-bold text-emerald-400">{user.username}</h2>

      <h2 className="text-lg font-bold text-emerald-400">
        {sentCount > 0
          ? `has sent ${sentCount} queue${sentCount > 1 ? "s" : ""} :D`
          : "hasn't sent any queues"}
      </h2>

      <p className="text-emerald-400">
        ok you're probably all like 'why isn't there more here' which is totally
        fair but like c'mon man i made this in a weekend give me some slack. or
        rather, ideas & feedback on how i can improve the experience, directed
        to: jewellcommajared (at) gmail (dot) com. thanks for using SendIt, i
        hope you have a wonderful day {"<3"}
      </p>

      <Form method="post" action="/logout">
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </Form>
    </div>
  );
}
