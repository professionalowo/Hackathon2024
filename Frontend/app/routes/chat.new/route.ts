import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { addChats } from "~/.server/chats";

export async function loader({ request }: LoaderFunctionArgs) {
    const chat = await addChats({ timestamp: Date.now(), sources: [] });
    let url = `/chat/${chat[0].id}`;
    const requestUrl = new URL(request.url);
    if (requestUrl.searchParams.has("open")) {
        url += `?open=${requestUrl.searchParams.get("open")!}`
    }
    if (requestUrl.searchParams.has("initial")) {
        url += `?initial=${requestUrl.searchParams.get("initial")!}`
    }
    return redirect(url);
}