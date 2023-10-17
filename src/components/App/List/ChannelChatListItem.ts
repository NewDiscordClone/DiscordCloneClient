import IListElement from "./IListElement";
import Channel from "../../../models/Channel";
import {ContextOption} from "../ContextMenu/ContextOption";

class ChannelChatListItem implements IListElement {
    get id(): string {
        return this.channel.id as string;
    }

    get image(): string {
        return "";
    }
    get title(): string {
        return this.channel.title as string; //this.privateChat.title ?? this.privateChat.users.map(u => u.displayName).join(", ");
    }

    get subtitle(): string | undefined {
        return undefined //this.privateChat.users.length + " members";
    }

    clickAction: (() => void) | null = null;
    crossAction: (() => void) | null = null;

    public channel: Channel

    constructor(channel: Channel) {
        this.channel = channel;
    }

    isSelected: boolean = false;

    contextActions: (ContextOption | null)[] | null = null;

}

export default ChannelChatListItem;