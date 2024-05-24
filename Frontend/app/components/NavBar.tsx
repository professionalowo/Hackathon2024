import {NavLink} from "@remix-run/react"
import {useState} from "react"
import {cn} from "~/lib/cn"
import addIcon from "../assets/plus-lg.svg?url";
import menuIcon from "../assets/list.svg?url"

export type Message = { message: string, ai: boolean, timestamp: number }
export type Chat = { timestamp: number, messages: Message[] }
export type NavBarProps = { chats: Array<Chat> }

export function NavBar({chats}: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    return <nav
        className={cn("bg-slate-800 rounded-r h-full flex flex-row justify-start align-top", {"w-1/6": isOpen})}>
        <div className="flex flex-col h-full w-full gap-2 pt-10">
                <div className="flex flex-col pl-8">
                    <button className="align-middle justify center text-left text-xl" onClick={() => setIsOpen(o => !o)}><img alt="menu" src={menuIcon}/></button>
                </div>
            <div className="px-5 pb-4 w-full">
            <div className="hover-animation flex items-center rounded-full bg-purple-800 text-white py-2 hover:bg-purple-900">
                <button className="flex m-3 items-center w-full">
                    <img alt="add" src={addIcon} className="" style={{ minWidth: "32px" }}/>
                    {isOpen && <span className="w-full text-center">New Chat</span>}
                </button>
            </div>
            </div>
            {isOpen && chats.map(chat => (
                <NavLink unstable_viewTransition key={chat.timestamp}
                         className="hover:bg-slate-700 cursor-pointer rounded py-2 pl-5 " to={`/chat/${chat.timestamp}`}>
                    Chat {chat.timestamp}
                </NavLink>)
            )}
        </div>

    </nav>
}