import { redirect } from "@remix-run/node";
import { addChats } from "~/.server/chats";

export async function loader() {
    const chat = await addChats({ timestamp: Date.now() });
    return redirect(`/chat/${chat[0].id}`);
}