import { Await, NavLink } from "@remix-run/react"
import { ReactNode, Suspense, useState } from "react"
import { cn } from "~/lib/cn"
import addIcon from "../assets/plus-lg.svg?url";
import menuIcon from "../assets/list.svg?url"
import { ChatWithMessages } from "~/.server/chats";

export type NavBarProps = { chats: Array<ChatWithMessages> | Promise<Array<ChatWithMessages>> }
export function NavBar({ chats }: NavBarProps) {
    return <NavBarSkeleton>
        <Suspense fallback={
            <>
                {Array.from({ length: 5 }).map((_, i) => <MessageSkeleton key={i} />)}
            </>
        }>
            <Await resolve={chats}>
                {chats => chats.map(chat => (
                    <NavLink unstable_viewTransition key={chat.id}
                        className="hover:bg-slate-700 cursor-pointer rounded py-2 pl-5 " to={`/chat/${chat.id}`}>
                        Chat {chat.id}
                    </NavLink>)
                )}
            </Await>
        </Suspense>
    </NavBarSkeleton>
}

function MessageSkeleton() {
    return <div className="bg-slate-700 cursor-pointer rounded p-5 animate-pulse"></div>
}

export const NavBarSkeleton = ({ children }: { children?: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    return <nav
        className={cn("bg-slate-800 rounded-r h-full flex flex-row justify-start align-top", { "w-1/6": isOpen })}>
        <div className="flex flex-col h-full w-full gap-2 pt-10">
            <div className="flex flex-col pl-8">
                <button className="align-middle justify center text-left text-xl" onClick={() => setIsOpen(o => !o)}><img alt="menu" src={menuIcon} /></button>
            </div>
            <div className="px-5 pb-4 w-full">
                <div className="hover-animation flex items-center rounded-full bg-purple-800 text-white py-2 hover:bg-purple-900">
                    <button className="flex m-3 items-center w-full">
                        <img alt="add" src={addIcon} className="" style={{ minWidth: "32px" }} />
                        {isOpen && <span className="w-full text-center">New Chat</span>}
                    </button>
                </div>
            </div>
            {isOpen && children}
        </div>
    </nav>
}