import User from "./User";
import Attachment from "./Attachment";
import Reaction from "./Reaction";
import ServerProfile from "./ServerProfile";

export type MessageSend = {
    text: string,
    chatId: number,
    attachments: Attachment[]
}

type Message = {
    id: number | undefined
    user: User;
    text: string;
    sendTime: Date;
    attachments: Attachment[]
    reactions: Reaction[]
    //responseTo: Message | undefined;
    serverProfile: ServerProfile | undefined;
}
export default Message;