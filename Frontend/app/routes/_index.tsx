import type { MetaFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Chat with AGV RescueBot" },
    { name: "description", content: "Welcome to AGV RescueBot!" },
  ];
};

export default function Index() {
  return (
    <div
      className="gap-5 px-5 py-3 flex flex-col w-full h-full justify-center align-middle items-center font-mono">
      <h1 className="text-4xl">Welcome to AGV RescueBot!</h1>
      <p className="text-center text-lg">
        Your AGV error-fixing expert. Trust us for swift solutions and seamless operations!
      </p>
      <div className="hover-animation">
        <NavLink unstable_viewTransition className="px-5 py-3 bg-purple-800 hover:bg-purple-900 rounded-md" to={"/chat"}>Start Chatting</NavLink>
      </div>
    </div>
  );
}

