import { NavLink } from "@remix-run/react"
import { useState } from "react"
import { cn } from "~/lib/cn"

export type Message = { message: string, ai: boolean, timestamp: number }
export type Chat = { timestamp: number, messages: Message[] }
export type NavBarProps = { chats: Array<Chat> }
export function NavBar({ chats }: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    return <nav className={cn("bg-slate-800 rounded-r h-full flex flex-row justify-start align-top", { "w-1/4": isOpen })}>
        <div className="flex flex-col h-full w-full gap-2 py-4">
            {isOpen && chats.map(chat => (
                <NavLink unstable_viewTransition key={chat.timestamp} className="hover:bg-slate-700 cursor-pointer rounded py-2 px-1" to={`/chat/${chat.timestamp}`}>
                    Chat {chat.timestamp}
                </NavLink>)
            )}
        </div>
        <button className="text-left p-1" onClick={() => setIsOpen(o => !o)}>{!isOpen ? <p>&rarr;</p> : <p>&larr;</p>}</button>
    </nav>
}