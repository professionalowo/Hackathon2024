export function TypingDots() {
    return <div className='gap-1 flex justify-center items-center w-fit'>
        <span className='sr-only'>Loading...</span>
        <div className='h-3 w-3 bg-slate-100 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-3 w-3 bg-slate-100 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-3 w-3 bg-slate-100 rounded-full animate-bounce'></div>
    </div>;
}