import Chat from "./Chat";
import {UserStatus} from "./UserDetails";

export interface PrivateChatLookUp extends Chat {
    /** The URL of the private chat's image. */
    image?: string;
}

export interface PersonalChatLookUp extends PrivateChatLookUp {
    userStatus: UserStatus
    userTextStatus: string | undefined
}

export interface GroupChatLookUp extends PrivateChatLookUp {
    membersCount: number;

}

export default PrivateChatLookUp;