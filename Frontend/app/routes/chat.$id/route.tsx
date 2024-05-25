import { ActionFunctionArgs, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { ScrollRestoration, redirect, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useRef } from "react";
import { messagePromptFlow } from "~/.server/api";
import { getChatById } from "~/.server/chats";
import { ChatBox } from "~/components/ChatBox";
import { Message } from "~/components/Message";
import { fetchingContext } from "~/lib/context/fetchingContext";
import { TypingDots } from "~/components/TypingDots";
import { optimisticMessageContext } from "~/lib/context/optimisticMessageContext";
import { InitialGreeting } from "~/components/InitialGreeting";
import { handleAudioPost } from "~/.server/audio";

export function meta({ params }: MetaArgs) {
    return [{ title: `Chat ${params.id}` }];
}

export async function loader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if (!id) throw redirect("/chat");
    const chat = await getChatById(id);
    if (!chat) return redirect("/chat");
    return { chat };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = await request.formData();
    let message: string;
    if (data.get("audio")) {
        message = await handleAudioPost(data) ?? "";
    } else {
        message = data.get("prompt")! as string;
    }
    const simple = data.get("simple") as string | undefined;
    if (simple) message += " USE SIMPLE AND CONCISE LANGUAGE"
    const id = Number(params.id);
    const chat = await getChatById(id);
    const { sources } = await messagePromptFlow(message, chat!);
    return { sources };
}

export default function ChatInner() {
    const { chat } = useLoaderData<typeof loader>();
    const end = useRef<HTMLSpanElement>(null);
    const { isFetching } = useContext(fetchingContext)!;
    const { optimisticMessage } = useContext(optimisticMessageContext)!;
    useEffect(() => {
        end.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isFetching]);
    return (
        <ChatBox>
            <div className="flex flex-col gap-5 px-8 py-5 h-full">
                {chat?.messages.map(
                    (message) => <Message key={`${message.id}-${chat.id}`} message={message} />
                )}
                {isFetching && (<>
                    {optimisticMessage && <Message message={optimisticMessage!} />}
                    <div className="bg-orange rounded-3xl p-3 w-fit"><TypingDots /></div>
                </>)}
                {!isFetching && chat.sources && chat.sources.length > 0 && <div className="flex flex-row items-center gap-3 text-slate-300">
                    <small className="font-mono text-secondary">From:</small>
                    <div className="flex gap-2 w-fit p-2">
                        {(chat.sources).map(source => <p className="rounded-3xl w-fit px-5 py-1 bg-tertiary" key={source}>{source}</p>)}
                    </div>
                </div>}
                {chat?.messages.length === 0 && !isFetching && <InitialGreeting className={"flex flex-col items-center justify-center h-full gap-5 grow w-full"} />}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </ChatBox>
    )
}