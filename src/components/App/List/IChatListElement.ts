import PrivateChat from "../../../models/PrivateChat";
import IListElement from "./IListElement";

interface IChatListElement extends IListElement{
    privateChat: PrivateChat;
}
export default IChatListElement;
