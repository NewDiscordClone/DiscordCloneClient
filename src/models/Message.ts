import User from "./User";
import Attachment from "./Attachment";
import Reaction from "./Reaction";

type Message = {
    id: number | undefined
    user: User;
    text: string;
    sendTime: Date;
    attachments: Attachment[]
    reactions: Reaction[]
}
export default Message;