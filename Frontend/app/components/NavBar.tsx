import { Await, Link, NavLink, useSearchParams } from "@remix-run/react";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { cn } from "~/lib/cn";
import addIcon from "../assets/plus-lg.svg?url";
import menuIcon from "../assets/list.svg?url";
import { ChatWithMessages } from "~/.server/chats";
import {motion, Variants} from "framer-motion";

export type NavBarProps = { chats: Array<ChatWithMessages> | Promise<Array<ChatWithMessages>> };

export function NavBar({ chats }: NavBarProps) {
    return (
        <NavBarSkeleton>
            <Suspense fallback={<>{Array.from({ length: 5 }).map((_, i) => <MessageSkeleton key={i} />)}</>}>
                <Await resolve={chats}>
                    {chats => chats.map(chat => (
                        <NavLink
                            unstable_viewTransition
                            key={chat.id}
                            className="hover:bg-slate-700 cursor-pointer rounded py-2 pl-5"
                            to={{
                                pathname: `/chat/${chat.id}`,
                                search: (function () {
                                    if (typeof document !== "undefined") return location.search;
                                })()
                            }}
                        >
                            Chat {chat.id}
                        </NavLink>
                    ))}
                </Await>
            </Suspense>
        </NavBarSkeleton>
    );
}

function MessageSkeleton() {
    return <div className="bg-slate-700 cursor-pointer rounded p-5 animate-pulse"></div>;
}

export const NavBarSkeleton = ({ children }: { children?: ReactNode }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(searchParams.get("open") ?? false as boolean);

    useEffect(() => {
        setSearchParams(prev => ({ open: isOpen, ...prev }));
    }, [isOpen])

    const containerVariants = {
        open: { width: "16.66%", transition: { type: "spring", stiffness: 100,damping:20,duration:0.5 } },
        closed: { width: "6rem", transition: { type: "spring", stiffness: 100,damping:20 } },
    } satisfies Variants;

    const itemVariants = {
        open: { opacity: 1, x: 0, display: "",transition:{duration: 0.2} },
        closed: { opacity: 0, x: -20, transitionEnd: { display: "none" } },
    };

    return (
        <motion.nav
            initial={false}
            variants={containerVariants}
            animate={isOpen ? "open" : "closed"}
            className="bg-slate-800 h-full flex flex-col items-start pt-10"
        >
            <div className="self-start pl-8 mb-4">
                <button className="text-xl" onClick={() => setIsOpen(o => !o)}>
                    <img alt="menu" src={menuIcon} />
                </button>
            </div>
            <motion.div className="px-5 pb-4 w-full">
                <div className="flex items-center rounded-full bg-purple-800 text-white py-2 hover:bg-purple-900">
                    <Link
                        to={{
                            pathname: "/chat/new",
                            search: (function () {
                                if (typeof document !== "undefined") return location.search;
                            })()
                        }}
                        reloadDocument
                        className="w-full h-fit flex items-center"
                    >
                        <img alt="add" src={addIcon} className="m-3" style={{ minWidth: "32px" }} />
                        {isOpen && (
                            <motion.span variants={itemVariants} animate={isOpen ? "open" : "closed"} className="ml-2">
                                New Chat
                            </motion.span>
                        )}
                    </Link>
                </div>
            </motion.div>
            <div className="overflow-auto flex flex-col gap-3 w-full">
                {isOpen && children}
            </div>
        </motion.nav>
    );
};
