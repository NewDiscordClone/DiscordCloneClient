import PrivateChat from "../../../models/PrivateChat";
import IChatListElement from "./IChatListElement";

class GroupChatListItem implements IChatListElement {
    get id(): number {
        return <number>this.privateChat.id;
    }
    get image(): string {
        return <string>this.privateChat.image;
    }
    get title(): string {
        return this.privateChat.title ?? this.privateChat.users.map(u => u.displayName).join(", ");
    }
    get subtitle(): string | undefined {
        return this.privateChat.users.length + " members";
    }

    clickAction : (() => void) | null = null;
    crossAction : (() => void) | null = null;
    privateChat: PrivateChat;

    constructor(chat: PrivateChat) {
        this.privateChat = chat;
    }
    isSelected: boolean = false;

}
export default GroupChatListItem;