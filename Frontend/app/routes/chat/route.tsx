import { Outlet, useLoaderData } from "@remix-run/react";
import { type Chat, NavBar } from "~/components/NavBar";
import { getChats } from "~/.server/chats";
import { motion } from "framer-motion";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Chat with ai bot" },
    ];
}

export function loader() {
    const chats = getChats();
    return { chats }
}

export default function Chat() {
    const { chats } = useLoaderData<typeof loader>();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-row w-full h-full">
            <NavBar chats={chats} />
            <div className="flex flex-col w-full">
                <Outlet />
            </div>
        </motion.div>
    )
}