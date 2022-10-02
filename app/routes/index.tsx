import { redirect } from "@remix-run/server-runtime";
import { requireUser } from "~/session.server";
import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  requireUser(request);
  throw redirect("/received");
};
