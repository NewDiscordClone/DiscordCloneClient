import React, {useContext, useEffect, useState} from 'react';
import styles from './ChatSpace.module.scss'
import MessageSpace from "./MessageSpace/MessageSpace";
import MessageInput from "./MessageInput/MessageInput";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import InfoColumn from "../InfoColumn/InfoColumn";
import RelationshipSpace from "../RelationshipSpace/RelationshipSpace";
import FirstRow from "./FirstRow";
import {ActionType} from "../reducer";

/**
 * Hook responsible for saving and retrieving
 * @returns [savedScroll, setScrolledDistance]
 */
function useSaveScroll(): [(string | undefined), React.Dispatch<React.SetStateAction<string | undefined>>] {
    const [scrollMessageId, setScrollMessageId] = useState<string>();
    const {selectedChatId} = useContext(SelectedChatContext);
    const {dispatch, chats} = useContext(AppContext);
    const [prevChatId, setPrevChatId] = useState<string>();

    useEffect(() => {
        if(selectedChatId !== prevChatId){
            if(prevChatId){
                dispatch({
                    type: ActionType.ChatState,
                    value: {id: prevChatId, scrollMessageId: scrollMessageId}
                })
            }
            if(selectedChatId){
                const chat = chats.find(c => c.id === selectedChatId);
                if(chat)
                    setScrollMessageId(chat.scrollMessageId);
            }
        }
        setPrevChatId(scrollMessageId);
    }, [selectedChatId])

    return [scrollMessageId, setScrollMessageId];
}

const ChatSpace = () => {
    const [isSidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const {chats} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = chats.find(c => c.id === selectedChatId);
    const scrollMessageIdState = useSaveScroll();
    if (!chat) return <RelationshipSpace/>

    return (
        <>
            <div className={styles.chatSpaceColumn}>
                <FirstRow chat={chat as any} isSidebarHidden={isSidebarHidden}
                          switchSidebar={() => setSidebarHidden(!isSidebarHidden)}/>
                <div className={styles.secondRow}>
                    <MessageSpace scrollMessageState={scrollMessageIdState}/>
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