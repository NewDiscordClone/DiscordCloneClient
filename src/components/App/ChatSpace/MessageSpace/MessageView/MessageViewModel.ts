import Message from "../../../../../models/Message";
import {UserLookUp} from "../../../../../models/UserLookUp";

class MessageViewModel {
    get id() {
        return this._message.id;
    }
    get userId() {
        return this._message.author?.id;
    }
    get chatId() {
        return this._message.chatId;
    }
    get message(){
        return this._message;
    }
    get text(){
        return this._message.text;
    }
    get username(){
        return this.users[this.userId as string].displayName;
    }
    get image() {
        return this.users[this.userId as string].avatar;
    }
    get sendTime() {
        return this._message.sendTime;
    }
    get attachments() {
        return this._message.attachments;
    }
    get reactions() {
        return this._message.reactions;
    }

    constructor(private readonly _message: Message, private readonly users: {[id: string]: UserLookUp}) {}
}
export default MessageViewModel;