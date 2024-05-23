import {Message} from "~/components/NavBar";
import {useState} from "react";

export function Message({message: {message, ai, timestamp}}: { message: Message }) {
    const [date] = useState(new Date(timestamp));
    return <div className={"w-full flex flex-col " + (ai? "items-start":"items-end")}>
        <div className="w-fit px-5 py-3 m-5 rounded-3xl bg-slate-600">
            <p>{message}</p>
            <small>{date.toLocaleTimeString()}</small>
        </div>
    </div>
}