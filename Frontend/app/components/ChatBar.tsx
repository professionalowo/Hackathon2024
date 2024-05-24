import { useFetcher } from "@remix-run/react"
import { useContext, useEffect, useState } from "react";
import mic from "../assets/mic-fill.svg?url";
import micMute from "../assets/mic-mute-fill.svg?url";
import { fetchingContext } from "~/lib/context/fetchingContext"
import { optimisticMessageContext } from "~/lib/context/optimisticMessageContext";

export function ChatBar() {
    const fetcher = useFetcher();
    const [text, setText] = useState<string>("");
    const [isMicOpen, setIsMicOpen] = useState(false);
    const { setIsFetching } = useContext(fetchingContext)!;
    const { setOptimisticMessage } = useContext(optimisticMessageContext)!;
    const isSubmitting = fetcher.state === "submitting";

    useEffect(() => {
        setIsFetching(isSubmitting);
    }, [isSubmitting, setIsFetching])

    return <div className="flex justify-center items-end w-full h-fit p-4">
        <fetcher.Form className="flex w-full justify-center" method="post" autoComplete="off" onSubmit={() => {
            setOptimisticMessage({ id: -1, message: text, ai: false, timestamp: Date.now(), chatId: 0 });
            setText("");
        }}>
            <div className="flex flex-row bg-slate-600 text-slate-100 rounded-3xl px-4 py-3 w-1/2 text-xl animation">
                <input
                    disabled={isSubmitting}
                    placeholder="Enter your Message"
                    name="prompt"
                    className="w-full bg-slate-600 focus:outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <button className="hover-animation" type="button" onClick={() => setIsMicOpen(o => !o)}>
                    <img alt={"mic"} src={isMicOpen ? micMute : mic}>
                    </img>
                </button>
            </div>
        </fetcher.Form>
    </div>
}