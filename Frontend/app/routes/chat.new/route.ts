import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { addChats } from "~/.server/chats";

export async function loader({ request }: LoaderFunctionArgs) {
    const chat = await addChats({ timestamp: Date.now() });
    let url = `/chat/${chat[0].id}`;
    const requestUrl = new URL(request.url);
    if (requestUrl.searchParams.has("open")) {
        url += `?open=${requestUrl.searchParams.get("open")!}`
    }
    return redirect(url);
}