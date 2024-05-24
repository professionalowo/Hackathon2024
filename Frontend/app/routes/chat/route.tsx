import { Outlet, defer, useLoaderData } from "@remix-run/react";
import { NavBar } from "~/components/NavBar";
import { getChats } from "~/.server/chats";
import { motion } from "framer-motion";
import { createContext, useState } from "react";

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
type FetchingContext = { isFetching: boolean, setIsFetching: (isFetching: boolean) => void }
export const fetchingContext = createContext<FetchingContext | undefined>(undefined);
export default function Chat() {
    const [isFetching, setIsFetching] = useState(false);
    const { chats } = useLoaderData<typeof loader>();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-row w-full h-full">
            <NavBar chats={chats} />
            <fetchingContext.Provider value={{ isFetching, setIsFetching }}>
                <div className="flex flex-col w-full">
                    <Outlet />
                </div>
            </fetchingContext.Provider>
        </motion.div>
    )
}