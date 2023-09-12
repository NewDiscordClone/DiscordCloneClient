import React, {useContext, useState} from 'react';
import styles from './ChatSpace.module.scss'
import MessageSpace from "./MessageSpace/MessageSpace";
import MessageInput from "./MessageInput";
import Chat from "../../../models/Chat";
import ListItem from "../List/ListItem";
import {ActionType} from "../reducer";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import getListElement from "../List/getListElement";


const ChatSpace = () => {
    const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
    const {getData, chats, dispatch} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    if (!selectedChatId) return ( //Це не має відображатися зовсім, бо якщо жоден чат не обраний то на цьому місці має відображатися щось інше
        <div className={styles.chatSpaceColumn} style={{color: "white", justifyContent: "center", textAlign: "center"}}>
            <p>Жоден чат не обрано</p>
        </div>
    );

    const chat: Chat = chats.find(c => c.id === selectedChatId) as Chat;
    const listElement = getListElement(chat)
    const onLoadMessages = async () => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            try {
                const index = chats.findIndex(c => c.id === selectedChatId);
                //console.log(chats[index].allLoaded);
                if (!chats[index].allLoaded) {
                    const newMessages = await getData.getMessages(chats[index].id, chats[index].messages.length)
                    dispatch({type: ActionType.MessagesLoaded, value: newMessages});
                    if (newMessages.length <= 0)
                        dispatch({type: ActionType.ChatState, value: {...chats[index], allLoaded: true}})
                    console.log("loadMessages")
                }
            } catch (error) {
                console.error(error);
            } finally {
                setMessagesLoading(false);
            }
        }
    }
    return (
        <div className={styles.chatSpaceColumn}>
            <div className={styles.firstRow}>
                <ListItem element={listElement} isChannel={`channel` in listElement}/>
            </div>
            <div className={styles.secondRow}>
                <MessageSpace messages={chat.messages} loadMessages={onLoadMessages}/>
            </div>
            <div className={styles.thirdRow}>
                <MessageInput/>
            </div>
        </div>
    );
};

export default ChatSpace;