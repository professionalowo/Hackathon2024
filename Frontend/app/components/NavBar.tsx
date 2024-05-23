import { NavLink } from "@remix-run/react"

export type Message = { message: string, ai: boolean, timestamp: number }
export type Chat = { timestamp: number, messages: Message[] }
export type NavBarProps = { chats: Array<Chat> }
export function NavBar({ chats }: NavBarProps) {
    return <nav className="w-1/6 bg-slate-800 rounded-r h-full flex flex-col justify-start align-top">
        {chats.map(chat => (
            <NavLink key={chat.timestamp} className="hover:bg-slate-700 cursor-pointer rounded py-2 px-1" to={`/chat/${chat.timestamp}`}>
                Chat {chat.timestamp}
            </NavLink>)
        )}
    </nav>
}