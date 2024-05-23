import { NavLink } from "@remix-run/react"

export type Chat = number
export type NavBarProps = { chats: Array<Chat> }
export function NavBar({ chats }: NavBarProps) {
    return <nav className="w-1/6 bg-slate-800 rounded-r">
        <ol>
            {chats.map(chat => (
                <li key={chat} className="p-2 hover:bg-slate-700 cursor-pointer rounded w-full h-full">
                    <NavLink className="w-full h-full" to={`/chat/${chat}`}>Chat {chat}</NavLink>
                </li>
            ))}
        </ol>
    </nav>
}