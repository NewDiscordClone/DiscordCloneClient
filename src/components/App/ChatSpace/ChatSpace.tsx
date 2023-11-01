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
function useSaveScroll(): React.Dispatch<React.SetStateAction<string | undefined>> {
    const [scrollMessageId, setScrollMessageId] = useState<string>();
    const {selectedChatId} = useContext(SelectedChatContext);
    const {dispatch, chats} = useContext(AppContext);
    const [prevChatId, setPrevChatId] = useState<string>();

    useEffect(() => {
        if (selectedChatId !== prevChatId) {
            if (prevChatId) {
                console.log("saved: " + scrollMessageId);
                dispatch({
                    type: ActionType.ChatState,
                    value: {id: prevChatId, scrollMessageId: scrollMessageId}
                })
            }
            if (selectedChatId) {
                const chat = chats[selectedChatId];
                if (chat && chat.scrollMessageId) {
                    document.getElementById(chat.scrollMessageId)?.scrollIntoView({block: "center"});
                }
            }
        }
        setPrevChatId(selectedChatId);
    }, [selectedChatId])

    return setScrollMessageId;
}

const ChatSpace = () => {
    const [isSidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const {chats} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = selectedChatId ? chats[selectedChatId] : undefined;
    const setScrollMessageId = useSaveScroll();
    if (!chat) return <RelationshipSpace/>

    return (
        <>
            <div className={styles.chatSpaceColumn}>
                <FirstRow chat={chat as any} isSidebarHidden={isSidebarHidden}
                          switchSidebar={() => setSidebarHidden(!isSidebarHidden)}/>
                <div className={styles.secondRow}>
                    <MessageSpace setScrollMessageId={setScrollMessageId}/>
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