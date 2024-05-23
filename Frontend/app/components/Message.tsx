import { type Message } from "~/components/NavBar";
import { useState } from "react";
import { cn } from "~/lib/cn";

export function Message({ message: { message, ai, timestamp } }: { message: Message }) {
    const [date] = useState(new Date(timestamp));
    return <div className={cn("w-full flex flex-col", { "items-start pr-10": ai }, { "items-end pl-10": !ai })}>
        <div className={cn("flex flex-col w-fit px-5 py-3 m-5 rounded-3xl bg-slate-600", { "bg-purple-800": ai })}>
            <p>{message}</p>
            <small className="flex flex-col items-end">{date.toLocaleTimeString("de-DE")}</small>
        </div>
    </div>
}