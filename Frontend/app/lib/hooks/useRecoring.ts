import { useEffect, useState } from "react";
import { useMicrophone } from "./useMicrophone";

const useRecording = (isMicOpen: boolean) => {
    const [recorded, setRecorded] = useState<Blob[]>([]);
    const { media } = useMicrophone(isMicOpen);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    useEffect(() => {
        if (media) {
            const recorder = new MediaRecorder(media);
            recorder.ondataavailable = handleDataAvailable;
            setRecorder(recorder);
            recorder.start(1000);
        }
        return () => {
            if (recorder) {
                recorder.stop();
            }
        }
    }, [media])
    useEffect(() => {
        if (isMicOpen) {
            recorder?.start();
        } else {
            recorder?.stop();
            setRecorded([]);
        }
    }, [isMicOpen])

    function handleDataAvailable(event: BlobEvent) {
        setRecorded(prev => [...prev, event.data]);
        console.log(event.data);
    }
    return { data: new Blob(recorded, { type: "audio/ogg; codecs=opus" }) };
}

export { useRecording };