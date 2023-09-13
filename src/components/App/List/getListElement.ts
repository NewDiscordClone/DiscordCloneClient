import Chat from "../../../models/Chat";
import IListElement from "./IListElement";
import ChannelChatListItem from "./ChannelChatListItem";
import Channel from "../../../models/Channel";
import PrivateChat from "../../../models/PrivateChat";
import PrivateChatListItem from "./PrivateChatListItem";

const getListElement = (chat: Chat, clickAction: (chatId: string) => void = () => {}, isSelected: boolean = false): IListElement => {
    let element: IListElement

    if ("serverId" in chat) {
        element = new ChannelChatListItem(chat as Channel);
    } else {
        const privateChat = chat as PrivateChat;
        element = new PrivateChatListItem(privateChat);
    }
    element.clickAction = () => clickAction(element.id);
    element.isSelected = isSelected;
    return element;
}
export default getListElement;