import {PrivateChatLookUp} from "../../../models/PrivateChatLookUp";
import IChatListElement from "./IChatListElement";
import {ContextOption} from "../ContextMenu/ContextOption";

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
        if ("membersCount" in this.privateChat)
            return this.privateChat.membersCount +
                " member" + (this.privateChat.membersCount as number > 1 ? "s" : "");
        else if ("userTextStatus" in this.privateChat)
            return this.privateChat.userTextStatus as string

        return undefined
    }

    clickAction: (() => void) | null = null;
    crossAction: (() => void) | null = null;
    privateChat: PrivateChatLookUp;

    constructor(chat: PrivateChatLookUp) {
        this.privateChat = chat;
    }

    isSelected: boolean = false;
    contextActions: (ContextOption | null)[] | null = null;
}

export default PrivateChatListItem;