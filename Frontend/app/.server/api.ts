import { addMessageToChat, updateChatSummary } from "./chats";
import { Chat } from "./db/schema";

type Prompt = { summary: string | null, question: string };
type AIResponse = { summary: string, reply: string };
type APIClientProps = { baseUrl: `/${string}`, secure?: boolean };
class APIClient<TPrompt extends Record<string, unknown>, TResponse extends Record<string, unknown>> {
    private baseUrl: `/${string}`;
    private secure: boolean;
    constructor({ baseUrl, secure = false }: APIClientProps) {
        this.baseUrl = baseUrl
        this.secure = secure
    }
    async prompt(prompt: TPrompt) {
        const response = await fetch(`http${this.secure ? "s" : ""}://${import.meta.env.VITE_API_URL}${this.baseUrl}`, {
            method: "POST",
            body: JSON.stringify(prompt),
        });
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        return response.json() as Promise<TResponse>;
    }
}

export async function messagePromptFlow(message: string, { id, summary }: Chat) {
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    const addMessagePromise = addMessageToChat({ message, ai: false, timestamp: Date.now(), chatId: id });
    //const answerPromise = api.prompt({ question: message, summary: summary ?? null });
    const answerPromise = new Promise<AIResponse>((resolve) => resolve({ summary: summary ?? "", reply: "This is a test response" }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [messageInserted, answer] = await Promise.all([addMessagePromise, answerPromise]);

    const addAiMessagePromise = addMessageToChat({ message: answer.reply, ai: true, timestamp: Date.now(), chatId: id });
    const updateChatPromise = updateChatSummary(id, answer.summary);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [aiMessage, updatedChat] = await Promise.all([addAiMessagePromise, updateChatPromise]);
    return aiMessage;
}

export const api = new APIClient<Prompt, AIResponse>({ baseUrl: "/api" });