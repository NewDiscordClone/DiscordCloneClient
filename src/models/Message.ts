import {Reaction} from "./Reaction";
import {UserLookUp} from "./UserLookUp";
import Attachment from "./Attachment";

export interface Message {
    /** Unique Id as an string representation of an ObjectId type */
    id?: string | undefined;
    /** MessageView body */
    text?: string | undefined;
    /** Time when server received message */
    sendTime: Date;
    /** Time when message was pinned */
    pinnedTime?: Date | undefined;
    /** Flag that indicates whether the message is pinned or not */
    isPinned: boolean;
    /** List of reactions to the message */
    reactions?: Reaction[] | undefined;
    /** List of message attachment urls */
    attachments: Attachment[];
    user?: UserLookUp;
    /** Chat Id as an string representation of an ObjectId type */
    chatId: string;
}
export default Message;