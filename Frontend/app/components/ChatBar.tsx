import { useFetcher } from "@remix-run/react"

export function ChatBar() {
    const fetcher = useFetcher();
    return <div className="flex justify-center items-end w-full h-fit p-4">
        <fetcher.Form className="flex w-full justify-center" method="post" autoComplete="off">
            <input
                placeholder="Enter your Message"
                name="prompt"
                className="bg-slate-600 text-slate-100 rounded-3xl px-4 py-3 w-1/2 text-xl"
            />
        </fetcher.Form>
    </div>
}