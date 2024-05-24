import { useEffect, useState } from "react";
import { Message } from "~/.server/db/schema";

const useSpeechSynthesis = (message: Message) => {
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | undefined>(undefined);
    useEffect(() => {
        if (typeof document === "undefined" || !message.ai) return;
        const synthesis = new SpeechSynthesisUtterance(message.message);
        synthesis.lang = "en-US";
        setUtterance(synthesis);
    }, [])
    return utterance;
};

export { useSpeechSynthesis }