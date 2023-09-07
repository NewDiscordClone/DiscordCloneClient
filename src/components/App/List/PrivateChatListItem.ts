import {PrivateChat} from "../../../models/PrivateChat";
import IChatListElement from "./IChatListElement";

class PrivateChatListItem implements IChatListElement {
    get id(): string {
        return this.privateChat.id as string;
    }
    get image(): string {
        return this.privateChat.image as string;
    }
    get title(): string {
        return this.privateChat.title as string;
    }
    get subtitle(): string | undefined {
        return this.privateChat.subtitle;
    }

    clickAction : (() => void) | null = null;
    crossAction : (() => void) | null = null;
    privateChat: PrivateChat;

    constructor(chat: PrivateChat) {
        this.privateChat = chat;
    }
    isSelected: boolean = false;

}
export default PrivateChatListItem;