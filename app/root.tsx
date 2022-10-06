import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/app.css";
import { getUser, requireUser } from "./session.server";
import Layout from "./components/Layout";
import { useOptionalUser } from "./utils";

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://rsms.me/inter/inter.css",
    },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];
};

export let meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Send It",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  console.log(url);
  try {
    return json({
      user: await getUser(request),
      authError: url.searchParams.get("error"),
    });
  } catch (err) {
    throw err;
  }
}

export default function App() {
  let user = useOptionalUser();
  let { authError } = useLoaderData();

  return (
    <html lang="en" className="h-full overflow-hidden">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-dark-1000">
        {user && !authError ? (
          <Layout.Main>
            <Outlet />
          </Layout.Main>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
