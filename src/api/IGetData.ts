import User from "../models/User";
import Server from "../models/Server";
import PrivateChat from "../models/PrivateChat";
import Chat from "../models/Chat";
import Message from "../models/Message";
import {EventP} from "../Events";
import GetHardCodeData from "./GetHardCodeData";

interface IGetData{
    get user() : User;
    get servers() : Server[]
    get privateChats() : PrivateChat[]
    getMessages(chat: Chat, messagesCount: number): Message[];
    sendMessage(chat:Chat, message:Message) : void;
    get onMessageReceived() : EventP<{chat: Chat, message: Message }>
}
export default IGetData;