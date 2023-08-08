import User from "../models/User";
import ServerLookUp from "../models/ServerLookUp";
import PrivateChat from "../models/PrivateChat";
import Message, {MessageSend} from "../models/Message";
import {EventP} from "../Events";

interface IGetData{
    getUser(userId: number, serverId?: number | undefined) : Promise<User>;
    getCurrentUser() : Promise<User>;
    getServers() : Promise<ServerLookUp[]>;
    getPrivateChats() : Promise<PrivateChat[]>
    getMessages(chatId: number, messagesCount: number): Promise<Message[]>;
    sendMessage(message:MessageSend) : void;
    get onMessageReceived() : EventP<Message>
}
export default IGetData;