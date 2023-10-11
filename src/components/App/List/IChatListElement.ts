import PrivateChatLookUp from "../../../models/PrivateChatLookUp";
import IListElement from "./IListElement";

interface IChatListElement extends IListElement{
    privateChat: PrivateChatLookUp;
}
export default IChatListElement;
