import type { MetaFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "Chat with AI" },
    { name: "description", content: "Welcome to the AI Chat!" },
  ];
};

export default function Index() {
  return (
    <div className="gap-5 px-5 py-3 flex flex-col w-full h-full justify-center align-middle items-center font-mono">
      <h1 className="text-4xl">Welcome to Remix!</h1>
      <p className="text-center text-lg">
        This is a new Remix app. You can start editing this file immediately to
        see how fast the hot module reloading is!
      </p>
      <NavLink className="px-5 py-3 bg-purple-800 hover:bg-purple-900 rounded-md" to={"/chat"}>Start Chatting</NavLink>
    </div>
  );
}