import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { ScrollRestoration, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { addMessageToChat, getChats } from "~/.server/chats";
import { Message } from "~/components/Message";

export function loader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if (!id) throw redirect("/chat");
    const chat = getChats().find(chat => chat.timestamp === id);
    return { chat };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = await request.formData();
    const prompt = data.get("prompt") as string;
    const id = Number(params.id);
    const chat = getChats().find(chat => chat.timestamp === id)!;
    addMessageToChat(chat, { message: prompt, ai: false, timestamp: Date.now() });
    return { prompt };
}

export default function ChatInner() {
    const { chat } = useLoaderData<typeof loader>();
    const end = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        end.current?.scrollIntoView();
    }, [chat]);
    return (
        <div className="overflow-auto grow">
            <div className="flex flex-col">
                {chat?.messages.map(
                    (message, index) => <Message key={index} message={message} />
                )}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </div>
    )
}