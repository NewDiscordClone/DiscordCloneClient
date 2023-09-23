import React, {useContext, useState} from 'react';
import styles from './ChatSpace.module.scss'
import MessageSpace from "./MessageSpace/MessageSpace";
import MessageInput from "./MessageInput";
import Chat from "../../../models/Chat";
import ListItem from "../List/ListItem";
import {ActionType} from "../reducer";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import getListElement from "../List/getListElement";
import RelationshipSpace from "../RelationshipSpace/RelationshipSpace";


const ChatSpace = () => {
    const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
    const {getData, chats, dispatch} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    if (!selectedChatId) return <RelationshipSpace/>
    const chat: Chat = chats.find(c => c.id === selectedChatId) as Chat;

    const onLoadMessages = async () => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            try {
                const index = chats.findIndex(c => c.id === selectedChatId);
                //console.log(chats[index].allLoaded);
                if (!chats[index].allLoaded) {
                    const newMessages = await getData.messages.getMessages(chats[index].id, chats[index].messages.length)
                    dispatch({type: ActionType.MessagesLoaded, value: newMessages});
                    if (newMessages.length <= 0)
                        dispatch({type: ActionType.ChatState, value: {...chats[index], allLoaded: true}})
                    // console.log("loadMessages")
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
                <ListItem element={getListElement(chat)} isChannel={`channel` in getListElement(chat)}/>
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