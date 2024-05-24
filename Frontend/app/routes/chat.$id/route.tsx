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
    await messagePromptFlow(prompt, chat!);
    return new Response(null, { status: 200 });
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
            <div className="flex flex-col gap-5 p-5 h-full">
                {chat?.messages.map(
                    (message) => <Message key={`${message.id}-${chat.id}`} message={message} />
                )}
                {isFetching && (<>
                    {optimisticMessage && <Message message={optimisticMessage!} />}
                    <div className="bg-purple-700 rounded-3xl p-3 w-fit"><TypingDots /></div>
                </>)}
                {chat?.messages.length === 0 && <InitialGreeting className={"flex flex-col items-center justify-center h-full grow"} />}
            </div>
            <span id="end" ref={end}></span>
            <ScrollRestoration />
        </ChatBox>
    )
}