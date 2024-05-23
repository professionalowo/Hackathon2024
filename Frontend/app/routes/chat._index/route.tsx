import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { ChatBox } from "~/components/ChatBox";
import { addChats } from "~/.server/chats";
import { Chat } from "~/components/NavBar";

export async function action({ request }: ActionFunctionArgs) {
    const url = new URL(request.url);
    console.log(url);
    const data = await request.formData();
    const message = data.get("prompt")! as string;
    // Check if the current path is exactly "/chat"
    const newChat: Chat = { timestamp: Date.now(), messages: [{ message, ai: false, timestamp: Date.now() }] };
    addChats(newChat);
    return redirect(`/chat/${newChat.timestamp}`);
}


export default function Home() {
    return <ChatBox>

    </ChatBox>
}