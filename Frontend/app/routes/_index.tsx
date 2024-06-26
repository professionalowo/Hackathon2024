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
      <h1 className="text-4xl">Welcome to <span className="text-orange">AGV</span> Doctor!</h1>
      <p className="text-center text-lg">
        Your AGV error-fixing expert. Trust us for swift solutions and seamless operations!
      </p>
      <div className="hover-animation">
        <NavLink unstable_viewTransition className="px-5 py-3 bg-orange text-slate-900 hover:bg-orange-400 rounded-md" to={"/chat"}>Start Chatting</NavLink>
      </div>
    </div>
  );
}

