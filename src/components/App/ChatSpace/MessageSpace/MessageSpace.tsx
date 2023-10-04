import React, {useContext, useCallback, useEffect, useRef, useState} from 'react';
import styles from "./MessageSpace.module.scss"
import MessageViewModel from "./MessageView/MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView/MessageView";
import {ActionType} from "../../reducer";
import {AppContext, SelectedChatContext} from "../../../../Contexts";
import {VolumeProvider} from "./VolumeProvider";

type Props = {
    messages: Message[],
    loadMessages: () => void;
}
const MessageSpace = ({messages, loadMessages}: Props) => {
    const [scrolledDistance, setScrolledDistance] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const {selectedChatId, chatChanged} = useContext(SelectedChatContext);
    const {chats, dispatch} = useContext(AppContext);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (container) {
            const distanceFromBottom = -container.scrollTop;
            setScrolledDistance(distanceFromBottom);
            // console.log(distanceFromBottom);
            if (distanceFromBottom >= container.scrollHeight - container.clientHeight) {
                loadMessages()
            }
        }
    }, [loadMessages]);

    useEffect(() => {
        const onChatChanged = ({oldChat, newChat}: { oldChat: string | undefined, newChat: string | undefined }) => {
            if (oldChat)
                dispatch({type: ActionType.ChatState, value: {id: selectedChatId, scroll: scrolledDistance}})
            if (newChat) setScrolledDistance(chats.find(c => c.id === newChat)?.scroll ?? 0);
        }

        chatChanged.addListener(onChatChanged)
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            chatChanged.removeListener(onChatChanged);
            containerRef.current?.removeEventListener('scroll', handleScroll);

        }
    }, [chatChanged, handleScroll, loadMessages, scrolledDistance, setScrolledDistance])
// Set the scroll position to the saved distance from the bottom after rendering
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // if(prevHeight!=container.scrollHeight){
            container.scrollTop = -scrolledDistance;
            // setPrevHeight(container.scrollHeight);
            // }
        }
        handleScroll();
    });
    const messagesToView = [...messages];
    return (
        <VolumeProvider>
            <div className={styles.messageContainer} ref={containerRef}>
                {messagesToView.map((m, i) => <MessageView key={m.id} message={new MessageViewModel(m)}
                                                           prev={messagesToView[i + 1]}/>)}
            </div>
        </VolumeProvider>
    );
};

export default MessageSpace;