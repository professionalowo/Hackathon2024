import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { type MessageInsert, chats, messages, ChatInsert } from "./db/schema";

export async function getChats() {
    return db.query.chats.findMany({
        with: { messages: true }
    });
}
export async function addChats(chat: ChatInsert) {
    return db.insert(chats).values(chat).returning();
}

export async function addMessageToChat(message: MessageInsert) {
    return db.insert(messages).values(message).returning();
}

export async function getChatById(id: number) {
    return db.query.chats.findFirst({
        where(fields, { eq }) {
            return eq(fields.id, id);
        },
        with: { messages: true }
    });
}

export async function removeChatById(id: number) {
    return Promise.all([
        db.delete(messages).where(eq(messages.chatId, id)),
        db.delete(chats).where(eq(chats.id, id))
    ]);
}

export async function updateChatSummary(id: number, summary: string) {
    return db.update(chats).set({ summary }).where(eq(chats.id, id)).returning();
}

export async function updateChatSources(id: number, sources: string[]) {
    return db.update(chats).set({ sources }).where(eq(chats.id, id)).returning();
}

export type ChatWithMessages = Awaited<ReturnType<typeof getChats>>[number];