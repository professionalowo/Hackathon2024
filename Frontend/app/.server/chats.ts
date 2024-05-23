import {Chat} from "~/components/NavBar";
const chats:Chat[] = [{timestamp:1,messages:[]},{timestamp:2,messages:[]},{timestamp:3,messages:[]},{timestamp:4,messages:[]},{timestamp:5,messages:[]}];

export function getChats():Array<Chat>{
    return chats;
}
export function addChats(chat:Chat){
    chats.push(chat)
}

export function addMessageToChat(chat:Chat,message:string){
    chat.messages.push(message);
}