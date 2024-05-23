import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { addMessageToChat, getChats } from "~/.server/chats";
import {Message} from "~/components/Message";

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
    return (
        <div className="overflow-auto grow">
            <div className="flex flex-col">
                {chat?.messages.map(
                    (message, index) => <Message key={index} message={message}/>
                )}
            </div>
        </div>
    )
}