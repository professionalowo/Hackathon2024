import { Outlet, defer, useLoaderData } from "@remix-run/react";
import { NavBar } from "~/components/NavBar";
import { getChats } from "~/.server/chats";
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchingContext } from "~/lib/context/fetchingContext";
import { optimisticMessageContext } from "~/lib/context/optimisticMessageContext";
import { Message } from "~/.server/db/schema";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Chat with ai bot" },
    ];
}

export async function loader() {
    const chats = getChats();
    return defer({ chats });
}

export default function Chat() {
    const [isFetching, setIsFetching] = useState(false);
    const [optimisticMessage, setOptimisticMessage] = useState<Message | undefined>(undefined);
    const { chats } = useLoaderData<typeof loader>();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-row w-full h-full">
            <NavBar chats={chats} />
            <fetchingContext.Provider value={{ isFetching, setIsFetching }}>
                <optimisticMessageContext.Provider value={{ optimisticMessage, setOptimisticMessage }}>
                    <div className="flex flex-col w-full">
                        <Outlet />
                    </div>
                </optimisticMessageContext.Provider>
            </fetchingContext.Provider>
        </motion.div>
    )
}