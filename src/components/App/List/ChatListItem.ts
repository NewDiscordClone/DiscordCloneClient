import IListElement from "./IListElement";
import PrivateChat from "../../../models/PrivateChat";

class ChatListItem implements IListElement {
    get id(): number {
        return <number>this._chat.id;
    }
    get image(): string {
        return <string>this._chat.image;
    }
    get title(): string {
        return this._chat.title ?? this._chat.users.map(u => u.displayName).join(", ");
    }
    get subtitle(): string | null {
        return this._chat.users.length + " members";
    }

    clickAction : (() => void) | null = null;
    crossAction : (() => void) | null = null;

    private _chat : PrivateChat;


    constructor(chat: PrivateChat) {
        this._chat = chat;
    }
}
export default ChatListItem;