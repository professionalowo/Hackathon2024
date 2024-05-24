import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { ChatBox } from "~/components/ChatBox";
import { addChats } from "~/.server/chats";
import { type ChatInsert } from "~/.server/db/schema";
import { messagePromptFlow } from "~/.server/api";
import {InitialGreeting} from "~/components/InitialGreeting";

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    let message = data.get("prompt")! as string;
    const simple = data.get("simple") as string | undefined;
    if(simple) message += " use simple and concise language"
    const newChat: ChatInsert = { timestamp: Date.now() };
    const addedChat = await addChats(newChat);
    await messagePromptFlow(message, addedChat[0]);
    return redirect(`/chat/${addedChat[0].id}`);
}


export default function Home() {
    return <ChatBox>
        <InitialGreeting className={"flex flex-col items-center justify-center gap-3 h-full"}/>
    </ChatBox>
}