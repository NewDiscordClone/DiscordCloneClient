import React, {useContext, useState} from 'react';
import styles from './ChatSpace.module.scss'
import MessageSpace from "./MessageSpace/MessageSpace";
import MessageInput from "./MessageInput/MessageInput";
import {ActionType} from "../reducer";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import InfoColumn from "../InfoColumn/InfoColumn";
import RelationshipSpace from "../RelationshipSpace/RelationshipSpace";
import FirstRow from "./FirstRow";


const ChatSpace = () => {
    const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
    const [isSidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const {getData, chats, dispatch} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = chats.find(c => c.id === selectedChatId);
    if (!chat) return <RelationshipSpace/>
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
        <>
            <div className={styles.chatSpaceColumn}>
                <FirstRow chat={chat as any} isSidebarHidden={isSidebarHidden} switchSidebar={() =>setSidebarHidden(!isSidebarHidden)}/>
                <div className={styles.secondRow}>
                    <MessageSpace messages={chat.messages} loadMessages={onLoadMessages}/>
                </div>
                <div className={styles.thirdRow}>
                    <MessageInput/>
                </div>
            </div>
            <InfoColumn hidden={isSidebarHidden}/>
        </>
    );
};

export default ChatSpace;