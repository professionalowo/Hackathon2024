import { useFetcher, useSearchParams } from "@remix-run/react"
import { useContext, useEffect, useState } from "react";
import mic from "../assets/mic-fill.svg?url";
import micMute from "../assets/mic-mute-fill.svg?url";
import { fetchingContext } from "~/lib/context/fetchingContext"
import { optimisticMessageContext } from "~/lib/context/optimisticMessageContext";
import { useRecording } from "~/lib/hooks/useRecoring";

export function ChatBar() {
    const fetcher = useFetcher();
    const [expert, setExpert] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [text, setText] = useState<string>(searchParams.get("initial") ?? "");
    const [isMicOpen, setIsMicOpen] = useState(false);
    const { setIsFetching } = useContext(fetchingContext)!;
    const { setOptimisticMessage } = useContext(optimisticMessageContext)!;
    const { data } = useRecording(isMicOpen);
    const isSubmitting = fetcher.state === "submitting";
    useEffect(() => {
        if (searchParams.get("initial")) {
            setText(searchParams.get("initial")!);
        }
    }, [searchParams])
    useEffect(() => {
        setIsFetching(isSubmitting);
    }, [isSubmitting, setIsFetching])
    useEffect(() => {
        console.log(data);
        if (!isMicOpen && data.size > 0) {
            const formData = new FormData();

            formData.append("audio", data, "audio.ogg");
            fetcher.submit(formData, { method: "POST", encType: "multipart/form-data" });
            console.log("submitted " + data.size);
            console.log(formData);
        }
    }, [isMicOpen])

    return <div className="flex flex-col justify-center items-end w-full h-fit p-4 gap-2">
        <div className="flex flex-row self-center gap-1">
            <h4>Include more technical Context and detailed explanations in the answer?</h4>
            <input type="checkbox" id="switch" checked={expert} onChange={e => {
                setExpert(e.target.checked);
            }} />
            <label htmlFor="switch">Toggle</label>
        </div>
        <fetcher.Form className="flex flex-row w-full justify-center gap-3" method="post" autoComplete="off" onSubmit={() => {
            if (!searchParams.get("initial"))
                setOptimisticMessage({ id: -1, message: text, ai: false, timestamp: Date.now(), chatId: 0 });
            setSearchParams(prev => {
                prev.delete("initial");
                return prev;
            })
            setText("");
        }}>
            <div className="flex flex-row bg-tertiary text-slate-100 rounded-3xl px-4 py-3 w-1/2 text-xl animation">
                <input
                    disabled={isSubmitting}
                    placeholder="Enter your Message"
                    name="prompt"
                    className="w-full bg-tertiary focus:outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                {!expert && <input type="hidden" id="simple" name="simple" value="true" />}
                <button className="hover-animation" type="button" onClick={() => setIsMicOpen(o => !o)}>
                    <img alt={"mic"} src={isMicOpen ? micMute : mic}>
                    </img>
                </button>
            </div>
        </fetcher.Form>
    </div>
}