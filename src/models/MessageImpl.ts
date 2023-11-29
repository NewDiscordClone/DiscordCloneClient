import Message from "./Message";
import Attachment from "./Attachment";
import {UserLookUp} from "./UserLookUp";
import {Reaction} from "./Reaction";

class MessageImpl implements Message{
    id: string | undefined;
    chatId: string;
    text: string | undefined;
    sendTime: Date;
    attachments: Attachment[];
    isPinned: boolean;
    pinnedTime: Date | undefined;
    reactions: Reaction[];
    get author(): UserLookUp {
        return this.users[this.userId];
    }
    private readonly userId: string;
    constructor(message: Message, private users: {[id:string]: UserLookUp}) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.text = message.text;
        this.sendTime = message.sendTime;
        this.attachments = message.attachments;
        this.isPinned = message.isPinned;
        this.pinnedTime = message.pinnedTime;
        this.reactions = message.reactions;
        this.userId = (message.author as {id: string}).id;
    }
}
export default MessageImpl;