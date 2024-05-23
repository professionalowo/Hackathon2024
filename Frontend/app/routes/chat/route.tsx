import { Outlet, useLoaderData } from "@remix-run/react";
import { NavBar } from "~/components/NavBar";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Chat with ai bot" },
    ];
}
export function loader() {
    return { chats: [1, 2, 3, 4, 5] }
}


export default function Chat() {
    const { chats } = useLoaderData<typeof loader>();
    return (
        <div className="flex flex-row w-full h-full">
            <NavBar chats={chats} />
            <div className="w-full">
                <Outlet />
                <input placeholder="Enter your Message" name="prompt" className="bg-slate-600 text-slate-100 rounded"/>
            </div>
        </div>
    )
}