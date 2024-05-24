import { useState } from "react";
import { cn } from "~/lib/cn";
import { motion } from "framer-motion";
import { type Message } from "~/.server/db/schema";
import volumeUpIcon from "../assets/volume-up-fill.svg?url";
import volumeMuteIcon from "../assets/volume-mute-fill.svg?url";

export function Message({ message: { message, ai, timestamp } }: { message: Message }) {
    const [date] = useState(new Date(timestamp));
    const [isVolumeOn, setIsVolumeOn] = useState(false);
    const isAi = ai;
    return <div className={cn("w-full flex flex-col", { "items-start pr-10": ai }, { "items-end pl-10": !ai })}>
        <motion.div
            transition={{ type: "spring", damping: 10, stiffness: 120 }}
            initial={{ x: (ai ? -100 : 100) }}
            animate={{ x: 0 }}
            className={cn("flex flex-row w-fit px-5 py-3 gap-3 rounded-3xl bg-slate-600", { "bg-purple-800": ai })}>
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <p>{message}</p>
                    <small className="flex flex-col items-end">{date.toLocaleTimeString("de-DE")}</small>
                </div>
            </div>{isAi && (
            <div className={"flex flex-row"}>
                <div className="flex flex-col">
                <button className="hover-animation" type="button" onClick={() => setIsVolumeOn(o => !o)}>
                    <img alt={"mic"} src={isVolumeOn ? volumeUpIcon : volumeMuteIcon}>
                    </img>
                </button>
                </div>
            </div>)}
        </motion.div>
    </div>
}