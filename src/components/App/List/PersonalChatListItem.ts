import PrivateChatListItem from "./PrivateChatListItem";
import {PersonalChatLookUp} from "../../../models/PrivateChatLookUp";
import {UserLookUp} from "../../../models/UserLookUp";
import {UserStatus} from "../../../models/UserDetails";

class PersonalChatListItem extends PrivateChatListItem {

    get userId() : string {
        return this.personalChat.userId
    }
    override get title(): string {
        return this.users[this.userId]?.displayName ?? this.personalChat.title ?? ""
    }
    override get image(): string {
        return this.users[this.userId]?.avatar ?? this.personalChat.image ?? ""
    }
    override get subtitle(): string | undefined {
        return this.users[this.userId]?.textStatus ?? this.personalChat.userTextStatus
    }
    get userStatus(): UserStatus {
        return this.users[this.userId]?.status ?? this.personalChat.userStatus ?? UserStatus.Offline
    }
    constructor(private personalChat: PersonalChatLookUp, private users: {[id: string]: UserLookUp}) {
        super(personalChat);
    }
}
export default PersonalChatListItem;