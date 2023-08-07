import User from "../models/User";
import Server from "../models/Server";
import PrivateChat from "../models/PrivateChat";
import Chat from "../models/Chat";
import Message, {MessageSend} from "../models/Message";
import {EventP} from "../Events";
import Attachment, {AttachmentType} from "../models/Attachment";

interface IGetData{
    user() : Promise<User>;
    servers() : Promise<Server[]>;
    privateChats() : Promise<PrivateChat[]>
    getMessages(chat: Chat, messagesCount: number): Promise<Message[]>;
    sendMessage(message:MessageSend) : void;
    get onMessageReceived() : EventP<Message & {chatId: number}>
}
export default IGetData;