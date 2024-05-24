import { createContext } from "react";

type FetchingContext = { isFetching: boolean, setIsFetching: (isFetching: boolean) => void }
export const fetchingContext = createContext<FetchingContext | undefined>(undefined);