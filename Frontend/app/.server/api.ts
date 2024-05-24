type Prompt = { text: string }
type AIResponse = { text: string };
class APIClient<TPrompt extends Record<string, unknown>, TResponse extends Record<string, unknown>> {
    async prompt(prompt: TPrompt) {
        const response = await fetch(import.meta.env.API_URL, {
            method: "POST",
            body: JSON.stringify(prompt),
        });
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        return response.json() as Promise<TResponse>;
    }
}

export const api = new APIClient<Prompt, AIResponse>();