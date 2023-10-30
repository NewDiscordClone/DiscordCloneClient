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
 * Hook responsible for saving and retrieving scrollTop when change selected chat
 * @returns [savedScroll, setScrolledDistance]
 */
function useSaveScroll(): [(number | undefined), React.Dispatch<React.SetStateAction<number | undefined>>] {
    const [savedScroll, setScrolledDistance] = useState<number>();
    const {selectedChatId} = useContext(SelectedChatContext);
    const {dispatch, chats} = useContext(AppContext);
    const [prevChatId, setPrevChatId] = useState<string>();

    useEffect(() => {
        // console.log("useEffect")
        // console.log(selectedChatId)
        // console.log(prevChatId)
        if (selectedChatId !== prevChatId) {
            if (prevChatId) {
                console.log(prevChatId + ") scroll save: " + savedScroll)
                dispatch({
                    type: ActionType.ChatState, value: {
                        id: prevChatId,
                        scroll: savedScroll
                    }
                })
            }
            if (selectedChatId) {
                const newChat = chats.find(c => c.id === selectedChatId);
                if (newChat) {
                    console.log("newChat.scroll: " + newChat.scroll)
                    setScrolledDistance(newChat.scroll ?? undefined)
                }
            }
        }
        setPrevChatId(selectedChatId)
    }, [selectedChatId]) //Saving and retrieving scroll

    return [savedScroll, setScrolledDistance];
}

const ChatSpace = () => {
    const [isSidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const {chats} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = chats.find(c => c.id === selectedChatId);
    const saveScrollState = useSaveScroll();
    if (!chat) return <RelationshipSpace/>

    return (
        <>
            <div className={styles.chatSpaceColumn}>
                <FirstRow chat={chat as any} isSidebarHidden={isSidebarHidden}
                          switchSidebar={() => setSidebarHidden(!isSidebarHidden)}/>
                <div className={styles.secondRow}>
                    <MessageSpace saveScrollState={saveScrollState}/>
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