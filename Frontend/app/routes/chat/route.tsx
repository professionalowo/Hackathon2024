import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { type Chat, NavBar } from "~/components/NavBar";
import { ActionFunctionArgs } from "@remix-run/node";
import { addChats, getChats } from "~/.server/chats";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Chat with ai bot" },
    ];
}

export async function action({ request }: ActionFunctionArgs) {
    const url = new URL(request.url);
    console.log(url);
    const data = await request.formData();
    const message = data.get("prompt")! as string;
    // Check if the current path is exactly "/chat"
    const newChat: Chat = { timestamp: Date.now(), messages: [{ message, ai: false, timestamp: Date.now() }] };
    addChats(newChat);
    return redirect(`/chat/${newChat.timestamp}`);
}

export function loader() {
    const chats = getChats();
    return { chats }
}

export default function Chat() {
    const { chats } = useLoaderData<typeof loader>();
    return (
        <div className="flex flex-row w-full h-full">
            <NavBar chats={chats} />
            <div className="flex flex-col w-full">
                <Outlet />
                <div className="flex justify-center items-end w-full h-full p-4">
                    <form className="flex w-full justify-center" method="post" autoComplete="off">
                        <input
                            placeholder="Enter your Message"
                            name="prompt"
                            className="bg-slate-600 text-slate-100 rounded-3xl px-4 py-3 w-1/2 text-xl"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}