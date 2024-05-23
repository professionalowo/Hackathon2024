import { Outlet } from "@remix-run/react";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Chat with ai bot" },
    ];
}

export default function Chat() {
    return (
        <div>
            <nav>
                Chat
            </nav>
            <Outlet />
        </div>
    )
}