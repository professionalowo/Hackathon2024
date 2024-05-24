import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { removeChatById } from "~/.server/chats";

export async function loader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if (!id) return new Response(null, { status: 404 });

    await removeChatById(id);
    return redirect("/chat");
}