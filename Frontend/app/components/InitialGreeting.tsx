import twoPeeps from '../assets/two_peeps.svg?url';
export function InitialGreeting(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div {...props}>
        <img src={twoPeeps} alt="twoPeeps" className="w-1/6 mx-auto" />
        <h1 className="text-4xl text-center font-light">Hey! How can I assist you today?</h1>
    </div>
}