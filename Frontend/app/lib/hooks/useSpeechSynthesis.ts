import { useEffect, useState } from "react";

const useSpeechSynthesis = (message: string) => {
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | undefined>(undefined);
    useEffect(() => {
        if (typeof document === "undefined") return;
        const synthesis = new SpeechSynthesisUtterance(message);
        synthesis.lang = "en-US";
        setUtterance(synthesis);
    }, [message])
    return utterance;
};

export { useSpeechSynthesis }