import { NavLink } from "@remix-run/react"

export type Chat = number
export type NavBarProps = { chats: Array<Chat> }
export function NavBar({ chats }: NavBarProps) {
    return <nav className="w-1/6 bg-slate-800 rounded-r h-full flex flex-col justify-start align-top">
        {chats.map(chat => (
            <NavLink key={chat} className="hover:bg-slate-700 cursor-pointer rounded py-2 px-1" to={`/chat/${chat}`}>
                Chat {chat}
            </NavLink>)
        )}
    </nav>
}