import { useFetcher } from "@remix-run/react"
import { useState } from "react";

export function ChatBar() {
    const fetcher = useFetcher();
    const [text, setText] = useState<string>("");
    return <div className="flex justify-center items-end w-full h-fit p-4">
        <fetcher.Form className="flex w-full justify-center" method="post" autoComplete="off" onSubmit={() => setText("")}>
            <input
                placeholder="Enter your Message"
                name="prompt"
                className="bg-slate-600 text-slate-100 rounded-3xl px-4 py-3 w-1/2 text-xl"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </fetcher.Form>
    </div>
}