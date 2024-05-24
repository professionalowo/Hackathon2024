import { db } from "./db/client";
import { chats, messages, type Chat, type Message } from "./db/schema";

export async function getChats() {
    return await db.query.chats.findMany({
        with: { messages: true }
    });
}
export async function addChats(chat: Chat) {
    await db.insert(chats).values(chat);
}

export async function addMessageToChat(message: Message) {
    await db.insert(messages).values(message);
}
export type ChatWithMessages = Awaited<ReturnType<typeof getChats>>[number];