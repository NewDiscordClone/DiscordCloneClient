import {PersonalChatLookUp} from "./PrivateChatLookUp";
import {UserLookUp} from "./UserLookUp";
import {SaveAttachments} from "../components/App/reducer";
import Message from "./Message";
import {UserStatus} from "./UserDetails";

class PersonalChatLookupImpl implements PersonalChatLookUp {
    id: string;
    userId: string;
    updatedDate: string;
    messages: (Message & SaveAttachments)[];
    get image(): string | undefined{
        return this.users[this.userId]?.avatar;
    }
    get title(): string {
        return this.users[this.userId].displayName;
    }
    get userStatus(): UserStatus {
        return this.users[this.userId].status as UserStatus;
    }
    get userTextStatus(): string | undefined {
        return this.users[this.userId].textStatus;
    }
    unreadMessagesCount: number;

    constructor(chat: PersonalChatLookUp, private users: {[id:string]: UserLookUp}) {
        this.id=chat.id;
        this.userId = chat.userId
        this.updatedDate=chat.updatedDate;
        this.messages = chat.messages
        this.unreadMessagesCount = chat.unreadMessagesCount;
    }


}
export default PersonalChatLookupImpl;