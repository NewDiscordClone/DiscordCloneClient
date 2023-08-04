import User from "../../../models/User";
import PrivateChat from "../../../models/PrivateChat";
import IChatListElement from "./IChatListElement";

class UserChatListItem implements IChatListElement {
    get id(): number {
        return <number>this.privateChat.id;
    }
    get image(): string {
        return this._user.avatarPath;
    }
    get title(): string {
        return this._user.displayName;
    }
    get subtitle(): string | null {
        return this._user.textStatus;
    }

    clickAction : (() => void) | null = null;
    crossAction : (() => void) | null = null;

    private _user : User;
    privateChat: PrivateChat;

    constructor(chat: PrivateChat, user: User) {
        this._user = user;
        this.privateChat = chat;
    }
    isSelected: boolean = false;
}
export default UserChatListItem;