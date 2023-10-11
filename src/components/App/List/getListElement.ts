import Chat from "../../../models/Chat";
import IListElement from "./IListElement";
import ChannelChatListItem from "./ChannelChatListItem";
import Channel from "../../../models/Channel";
import PrivateChatLookUp from "../../../models/PrivateChatLookUp";
import PrivateChatListItem from "./PrivateChatListItem";

const getListElement = (chat: Chat, clickAction: (chatId: string) => void = () => {}, isSelected: boolean = false): IListElement => {
    let element: IListElement

    if ("serverId" in chat) {
        element = new ChannelChatListItem(chat as Channel);
    } else {
        const privateChat = chat as PrivateChatLookUp;
        element = new PrivateChatListItem(privateChat);
    }
    element.clickAction = () => clickAction(element.id);
    element.isSelected = isSelected;
    return element;
}
export default getListElement;