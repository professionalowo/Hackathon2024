import { Await, Link, NavLink, useSearchParams } from "@remix-run/react";
import { ReactNode, Suspense, useEffect, useState } from "react";
import addIcon from "../assets/plus-lg.svg?url";
import menuIcon from "../assets/list.svg?url";
import { ChatWithMessages } from "~/.server/chats";
import { motion, Variants } from "framer-motion";
import xIcon from "../assets/x.svg?url";

export type NavBarProps = { chats: Array<ChatWithMessages> | Promise<Array<ChatWithMessages>> };

export function NavBar({ chats }: NavBarProps) {
    return (
        <NavBarSkeleton>
            <Suspense fallback={<>{Array.from({ length: 5 }).map((_, i) => <MessageSkeleton key={i} />)}</>}>
                <Await resolve={chats}>
                    {chats => chats.map(chat => (
                        <div key={chat.id} className="w-full flex flex-row gap-1 py-2 pl-5 items-center group hover:bg-slate-700 cursor-pointer rounded">
                        <NavLink
                            unstable_viewTransition
                            className="grow text-nowrap overflow-x-clip"
                            to={{
                                pathname: `/chat/${chat.id}`,
                                search: (function () {
                                    if (typeof document !== "undefined") return location.search;
                                })()
                            }}
                        >
                            Chat {chat.id}
                        </NavLink>
                            <Link to={`/chat/${chat.id}/delete`} className={"pr-5 invisible group-hover:visible"}>
                                <img alt={"x"} src={xIcon} className={"w-full h-full"}/>
                            </Link>
                        </div>
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
    const [isOpen, setIsOpen] = useState((searchParams.get("open")==="true"));

    useEffect(() => {
        setSearchParams(prev => ({ open: isOpen, ...prev }));
    }, [isOpen])

    const containerVariants = {
        open: { width: "16%", transition: { type: "tween", stiffness: 100, damping: 20 } },
        closed: { width: "7rem", transition: { type: "tween", stiffness: 100, damping: 20 } },
    } satisfies Variants;

    return (
        <motion.nav
            initial={false}
            variants={containerVariants}
            animate={isOpen ? "open" : "closed"}
            className="bg-slate-800 h-full flex flex-col items-start pt-10"
        >
            <div className="self-start pl-9 mb-4">
                <button className="text-xl" onClick={() => setIsOpen(o => !o)}>
                    <img alt="menu" src={menuIcon} />
                </button>
            </div>
            <div className="px-5 pb-4 w-full">
                <div className="flex items-center rounded-full bg-purple-800 text-white p-1 hover:bg-purple-900">
                    <Link
                        to={{
                            pathname: "/chat/new",
                            search: (function () {
                                if (typeof document !== "undefined") return location.search;
                            })()
                        }}
                        reloadDocument
                        className="w-full h-fit flex items-center overflow-x-clip"
                    >
                        <img alt="add" src={addIcon} className="m-3" style={{ minWidth: "32px" }} />
                        {isOpen && (
                            <span className="text-nowrap text-xl" style={{minWidth:"150px"}}>
                                New Chat
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            <div className="overflow-auto flex flex-col gap-3 w-full">
                {isOpen && children}
            </div>
        </motion.nav>
    );
};
