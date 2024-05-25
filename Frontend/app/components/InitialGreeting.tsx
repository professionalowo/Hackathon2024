import { ReactNode } from 'react';
import twoPeeps from '../assets/two_peeps.svg?url';
import { Link, LinkProps } from '@remix-run/react';
export function InitialGreeting(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div {...props}>
        <img src={twoPeeps} alt="twoPeeps" className="w-1/6 h-1/2 mx-auto mt-10" />
        <h1 className="text-4xl text-center font-light">Hey! How can I assist you today?</h1>
        <div className='h-1/2 w-full px-10 gap-10 flex flex-row justify-between align-middle pt-5'>
            <Card to={{
                pathname: ".",
                search: new URLSearchParams({ initial: "How to reboot an AGV? Explain the procedures." }).toString()
            }}>
                <p>How to reboot an AGV? Explain the procedures.</p>
            </Card>
            <Card to={{
                pathname: ".",
                search: new URLSearchParams({ initial: "I see an error, it says \"Failed going to goal\"." }).toString()
            }}>
                <p>I see an error, it says Failed going to goal.</p>
            </Card>
            <Card to={{
                pathname: ".",
                search: new URLSearchParams({ initial: "Help me understand this info: Awaiting new task" }).toString()
            }}>
                <p>Help me understand this info: Awaiting new task.</p>
            </Card>
        </div>
    </div>
}
function Card({ children, to }: { children: ReactNode, to: LinkProps["to"] }) {
    return <Link to={to} className='flex flex-col justify-center items-center text-center text-2xl gap-3 m-5 w-1/3 px-4 py-2 rounded shadow-sm shadow-slate-500  card-gradient hover-animation-s overflow-clip'>
        {children}
    </Link>
}