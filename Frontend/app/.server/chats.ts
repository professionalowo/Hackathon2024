import { db } from "./db/client";
import { type MessageInsert, chats, messages, type Chat, ChatInsert } from "./db/schema";

export async function getChats() {
    return await db.query.chats.findMany({
        with: { messages: true }
    });
}
export async function addChats(chat: ChatInsert) {
    return await db.insert(chats).values(chat).returning();
}

export async function addMessageToChat(message: MessageInsert) {
    return await db.insert(messages).values(message).returning();
}

export async function getChatById(id: number) {
    return await db.query.chats.findFirst({
        where(fields, { eq }) {
            return eq(fields.id, id);
        },
        with: { messages: true }
    });

}
export type ChatWithMessages = Awaited<ReturnType<typeof getChats>>[number];