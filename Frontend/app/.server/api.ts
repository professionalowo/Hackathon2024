import { addMessageToChat, updateChatSummary } from "./chats";
import { Chat } from "./db/schema";
import { z } from "zod";
type APIClientProps = { baseUrl: `/${string}`, secure?: boolean };

const PromptSchema = z.object({
    previous_summary: z.string().nullable(),
    text: z.string().min(1),
});

const AIResponseSchema = z.object({
    summary: z.string().min(1),
    reply: z.string().min(1),
    sources: z.array(z.string()),
})
type AIResponse = z.infer<typeof AIResponseSchema>;
type Prompt = z.infer<typeof PromptSchema>;
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
    //const prompt = PromptSchema.parse({ text: message, previous_summary: "" });
    //const answerPromise = api.prompt(prompt);
    const answerPromise = new Promise<AIResponse>((resolve) => resolve({ sources: [], summary: summary ?? "", reply: "This is a test response" }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [messageInserted, answer] = await Promise.all([addMessagePromise, answerPromise]);

    const addAiMessagePromise = addMessageToChat({ message: answer.reply, ai: true, timestamp: Date.now(), chatId: id });
    const updateChatPromise = updateChatSummary(id, answer.summary);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [aiMessage, updatedChat] = await Promise.all([addAiMessagePromise, updateChatPromise]);
    return aiMessage;
}

export const api = new APIClient<Prompt, AIResponse>({ baseUrl: "/query" });