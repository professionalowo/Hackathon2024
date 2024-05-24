
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
type UseMicrophone = {
    isError: true,
    isLoading: false,
    media: undefined
} |
{
    isLoading: true,
    isError: false,
    media: undefined
} |
{
    isLoading: false,
    isError: false,
    media: MediaStreamTrack | null
};
export function useMicrophone(activate: boolean) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    useEffect(() => {
        if (!activate && stream) {
            stream.getTracks().forEach(track => track.enabled = false);
        } else if (activate && stream) {
            stream.getTracks().forEach(track => track.enabled = true);
        }
    }, [activate,
        stream])
    const { data, isError, isLoading } = useQuery({
        queryKey: [activate, "mic"],
        queryFn: async () => {
            if (activate) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStream(stream);
                return stream;
            }
            return null;
        },
        staleTime: Infinity,
    });

    return { media: data?.getAudioTracks()[0], isError, isLoading } as UseMicrophone;
}
