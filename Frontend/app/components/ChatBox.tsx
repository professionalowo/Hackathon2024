import { ChatBar } from "./ChatBar";

export type ChatBoxProps = { children?: React.ReactNode };
export function ChatBox(props: ChatBoxProps) {
    return <div className="w-full h-full flex flex-col">
        <div className="overflow-auto grow">
            {props.children}
        </div>
        <ChatBar />
    </div>
}