import { ActionFunctionArgs, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { ScrollRestoration, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { addMessageToChat, getChatById } from "~/.server/chats";
import { ChatBox } from "~/components/ChatBox";
import { Message } from "~/components/Message";

export function meta({ params }: MetaArgs) {
    return [{ title: `Chat ${params.id}` }];
}

export async function loader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if (!id) throw redirect("/chat");
    const chat = await getChatById(id);
    return { chat };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = await request.formData();
    const prompt = data.get("prompt") as string;
    const id = Number(params.id);
    const message = await addMessageToChat({ message: prompt, ai: false, timestamp: Date.now(), chatId: id });
    return { message };
}

export default function ChatInner() {
    const { chat } = useLoaderData<typeof loader>();
    const end = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        end.current?.scrollIntoView();
    }, [chat]);
    return (
        <ChatBox>
            <div className="flex flex-col gap-5 p-5">
                {chat?.messages.map(
                    (message) => <Message key={`${message.id}-${chat.id}`} message={message} />
                )}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </ChatBox>
    )
}