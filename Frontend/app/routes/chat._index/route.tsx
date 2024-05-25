import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { ChatBox } from "~/components/ChatBox";
import { addChats } from "~/.server/chats";
import { type ChatInsert } from "~/.server/db/schema";
import { messagePromptFlow } from "~/.server/api";
import { InitialGreeting } from "~/components/InitialGreeting";
import { handleAudioPost } from "~/.server/audio";

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    let message: string;
    if (data.get("audio")) {
        message = await handleAudioPost(data) ?? "";
    } else {
        message = data.get("prompt")! as string;
    }
    const simple = data.get("simple") as string | undefined;
    if (simple) message += " USE SIMPLE AND CONCISE LANGUAGE"
    const newChat: ChatInsert = { timestamp: Date.now() };
    const addedChat = await addChats(newChat);
    await messagePromptFlow(message, addedChat[0]);
    return redirect(`/chat/${addedChat[0].id}`);
}


export default function Home() {
    return <ChatBox>
        <div className="flex flex-col gap-5 px-8 py-5 h-full">
            <InitialGreeting className={"flex flex-col items-center justify-center gap-5 h-full grow w-full"} />
        </div>
    </ChatBox>
}