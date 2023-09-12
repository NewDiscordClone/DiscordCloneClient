import React, {useContext} from 'react';
import {SelectedChatContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import List from "../List/List";
import getListElement from "../List/getListElement";
import styles from "./ChatsListColumn.module.scss"


type Props = {
    chats: Chat[];
}
const ChatsListColumn = ({chats}: Props) => {
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);

    return (
        <div className={styles.chatListColumn}>
            <List elements={chats.map(c => getListElement(c, selectChat, c.id === selectedChatId))}/>
        </div>
    );
};

export default ChatsListColumn;