import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { ChatBox } from "~/components/ChatBox";
import { addChats, addMessageToChat } from "~/.server/chats";
import { type ChatInsert } from "~/.server/db/schema";

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    const message = data.get("prompt")! as string;
    // Check if the current path is exactly "/chat"
    const newChat: ChatInsert = { timestamp: Date.now() };
    const addedChat = await addChats(newChat);
    await addMessageToChat({ message, ai: false, timestamp: Date.now(), chatId: addedChat[0].id });
    return redirect(`/chat/${addedChat[0].id}`);
}


export default function Home() {
    return <ChatBox>

    </ChatBox>
}