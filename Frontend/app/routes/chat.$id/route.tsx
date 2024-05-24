import { ActionFunctionArgs, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { ScrollRestoration, redirect, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useRef } from "react";
import { messagePromptFlow } from "~/.server/api";
import { getChatById } from "~/.server/chats";
import { ChatBox } from "~/components/ChatBox";
import { Message } from "~/components/Message";
import { fetchingContext } from "../chat/route";
import { TypingDots } from "~/components/TypingDots";

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
    const chat = await getChatById(id);
    await messagePromptFlow(prompt, chat!);
    return new Response(null, { status: 200 });
}

export default function ChatInner() {
    const { chat } = useLoaderData<typeof loader>();
    const end = useRef<HTMLSpanElement>(null);
    const { isFetching } = useContext(fetchingContext)!;
    useEffect(() => {
        end.current?.scrollIntoView();
    }, [chat, isFetching]);
    return (
        <ChatBox>
            <div className="flex flex-col gap-5 p-5">
                {chat?.messages.map(
                    (message) => <Message key={`${message.id}-${chat.id}`} message={message} />
                )}
                {isFetching && <div className="bg-purple-700 rounded-3xl p-3 w-fit"><TypingDots /></div>}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </ChatBox>
    )
}