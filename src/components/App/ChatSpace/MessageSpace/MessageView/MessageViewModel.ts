import Message from "../../../../../models/Message";

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
        return this._message.author?.displayName;
    }
    get image() {
        return this._message.author?.avatar;
    }
    get sendTime() {
        return this._message.sendTime;
    }
    get attachments() {
        return this._message.attachments;
    }

    constructor(private readonly _message: Message) {}
}
export default MessageViewModel;