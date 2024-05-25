import { ReactNode } from 'react';
import twoPeeps from '../assets/two_peeps.svg?url';
import { Link, LinkProps } from '@remix-run/react';
export function InitialGreeting(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div {...props}>
        <img src={twoPeeps} alt="twoPeeps" className="w-1/6 h-1/2 mx-auto mt-10" />
        <h1 className="text-4xl text-center font-light">Hey! How can I assist you today?</h1>
        <div className='h-full w-full px-10 gap-10 flex flex-row justify-between align-middle pt-5'>
            <Card to={"/chat"}>
                <h1 className='text-xl'>Errors</h1>
                <p>Ask me anytime you encounter an error!</p>
            </Card>
            <Card to={"/chat"}>
                <h1 className='text-xl'>Methods</h1>
                <p>Ask me about any method!</p>
            </Card>
            <Card to={"/chat"}>
                <h1 className='text-xl'>Troubleshooting</h1>
                <p>I will help you if you have problems!</p>
            </Card>
        </div>
    </div>
}
function Card({ children, to }: { children: ReactNode, to: LinkProps["to"] }) {
    return <Link to={to} className='flex flex-col justify-center items-center text-center text-2xl gap-3 m-5 w-1/3 px-4 py-2 rounded shadow-sm shadow-slate-500  card-gradient hover-animation-s overflow-clip'>
        {children}
    </Link>
}