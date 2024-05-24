import { createContext } from "react";
import { Message } from "~/.server/db/schema";

type OptimisticMessageContext = { optimisticMessage: Message | undefined, setOptimisticMessage: (message: Message) => void }
export const optimisticMessageContext = createContext<OptimisticMessageContext | undefined>(undefined);