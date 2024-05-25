import fs from "fs";
import { transcripeAudio, uploadAudio } from "./assemblyai";
export async function handleAudioPost(formData: FormData) {
    if (!formData.has("audio")) return;
    const blob = formData.get("audio");
    if (!blob) return "";
    const file = new File([blob], "audio.ogg", { type: "audio/ogg; codecs=opus" });
    console.log(file);
    fs.writeFileSync("audio.ogg", Buffer.from(new Uint8Array(await file.arrayBuffer())));

    const url = await uploadAudio("audio.ogg");
    const transcript = await transcripeAudio(url);
    if (transcript.utterances) {
        return transcript.utterances[0].text;
    }
    return "";
}   