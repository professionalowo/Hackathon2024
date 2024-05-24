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
    const prompt = data.get("prompt") as string;
    const id = Number(params.id);
    const chat = await getChatById(id);
    const { sources } = await messagePromptFlow(prompt, chat!);
    return { sources };
}

export default function ChatInner() {
    const { chat } = useLoaderData<typeof loader>();
    const { sources } = useLoaderData<typeof action>();
    const end = useRef<HTMLSpanElement>(null);
    const { isFetching } = useContext(fetchingContext)!;
    const { optimisticMessage } = useContext(optimisticMessageContext)!;
    useEffect(() => {
        end.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isFetching]);
    return (
        <ChatBox>
            <div className="flex flex-col gap-5 p-5 h-full">
                {chat?.messages.map(
                    (message) => <Message key={`${message.id}-${chat.id}`} message={message} />
                )}
                {isFetching && (<>
                    {optimisticMessage && <Message message={optimisticMessage!} />}
                    <div className="bg-orange rounded-3xl p-3 w-fit"><TypingDots /></div>
                </>)}
                {sources && <abbr className="text-xl" title={(sources??["what"]).map(s => s).join("\n")}>&ldquo;</abbr>}
                {chat?.messages.length === 0 && !isFetching && <InitialGreeting className={"flex flex-col items-center justify-center gap-3 h-full grow w-full"} />}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </ChatBox>
    )
}