import { Form, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof prisma.user.findUnique>>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await requireUser(request);
  const user = await prisma.user.findUnique({ where: { id } });
  return json<LoaderData>({ user });
};

export default function Profile() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="text-lg font-medium text-emerald-400">{user?.email}</h2>
      <Form method="post" action="/logout">
        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Button text
        </button>
      </Form>
    </div>
  );
}
