import {UserLookUp} from "./User";
import Attachment from "./Attachment";
import Reaction from "./Reaction";

export type MessageSend = {
    text: string,
    chatId: number,
    attachments: Attachment[]
}

export interface Message {
    id: number;
    user: UserLookUp;
    text: string;
    sendTime: Date;
    chatId: number;
    attachments?: Attachment[] | undefined;
    reactions?: Reaction[] | undefined;
}
export default Message;