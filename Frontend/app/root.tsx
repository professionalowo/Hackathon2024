import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "./css/main.css?url";
import lightmode from "./css/light.css?url";
import icon from "./assets/chat-left-dots.svg";
import { LinksFunction } from "@remix-run/node";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: lightmode, media: "(prefers-color-scheme: light)" },
  { rel: "icon", type: "image/svg", href: icon }
];

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen">

        <AnimatePresence mode="wait">
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
