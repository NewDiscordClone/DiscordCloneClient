import Message from "../../../../../models/Message";

class MessageViewModel {
    get message(){
        return this._message;
    }
    get text(){
        return this._message.text;
    }
    get username(){
        return this._message.user?.displayName;
    }
    get image() {
        return this._message.user?.avatar;
    }
    get sendTime() {
        return this._message.sendTime
    }
    get attachments() {
        return this._message.attachments;
    }

    constructor(private readonly _message: Message) {}
}
export default MessageViewModel;