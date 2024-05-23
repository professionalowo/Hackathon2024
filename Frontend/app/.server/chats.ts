import { Chat, Message } from "~/components/NavBar";
const chats: Chat[] = [{ timestamp: 1, messages: [{message:"How can i help you?",ai:true,timestamp:3}] }, { timestamp: 2, messages: [] }, { timestamp: 3, messages: [] }, { timestamp: 4, messages: [] }, { timestamp: 5, messages: [] }];

export function getChats(): Array<Chat> {
    return chats;
}
export function addChats(chat: Chat) {
    chats.push(chat)
}

export function addMessageToChat(chat: Chat, message: Message) {
    chat.messages.push(message);
}