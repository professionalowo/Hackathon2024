import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: LoaderFunctionArgs) {
    return { id: params.id };
}

export default function ChatInner() {
    const data = useLoaderData<typeof loader>()
    return (
        <div>
            <nav>
                {data.id ?? "No id"}
            </nav>
        </div>
    )
}