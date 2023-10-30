import React, {useContext, useEffect, useState} from 'react';
import MessageViewModel from "./MessageView/MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView/MessageView";
import {ActionType, ChatState} from "../../reducer";
import {AppContext, SelectedChatContext} from "../../../../Contexts";
import {VolumeProvider} from "./VolumeProvider";
import ScrollContainer from "./ScrollContainer/ScrollContainer";
import Chat from "../../../../models/Chat";
import {useSaveMedia} from "../../useSaveMedia";


let isMessagesLoading: boolean = false;
/**
 * Hook responsible for loading messages or retrieving them from memory
 * @returns object with messages and function for loading more messages or undefined if messages is not loaded yet
 */
function useLoadMessages() : {messages: Message[], loadMessages: () => void} | undefined{
    const {selectedChatId} = useContext(SelectedChatContext);
    const {chats, dispatch, getData} = useContext(AppContext);
    const chat = chats.find(c => c.id === selectedChatId) as (Chat & ChatState);
    const [newMessages, setNewMessages] = useState<Message[] | undefined>(undefined)
    const isLoaded = useSaveMedia(newMessages);

    async function loadMessages() {
        if (!isMessagesLoading) {
            isMessagesLoading = true;
            try {
                if (!chat.allLoaded) {
                    console.log("getMessages")
                    const newMessages = await getData.messages.getMessages(chat.id, chat.messages.length);
                    if(newMessages.length > 0)
                        setNewMessages(prev => newMessages);
                    else
                        dispatch({type: ActionType.ChatState, value: {...chat, allLoaded: true}})

                }
            } catch (error) {

            } finally {
                isMessagesLoading = false
            }
        }
    }
    useEffect(() => {
        if(chat.messages.length === 0){
            console.log("useEffect loadMessages")
            loadMessages()
        }
    }, [selectedChatId])
    useEffect(() => {
        if(newMessages !== undefined && isLoaded){
            dispatch({
                type: ActionType.MessagesLoaded,
                value: newMessages
            })
            setNewMessages([]);
        }
    }, [isLoaded])

    if (chat.messages.length > 0)
        return {messages: chat.messages, loadMessages};
    else
        return undefined;
}
function useMessageToEdit() : [(string | undefined), React.Dispatch<React.SetStateAction<string | undefined>>] {
    const [messageToEdit, setMessageToEdit] = useState<string>();


    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMessageToEdit(undefined)
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [])

    return [messageToEdit, setMessageToEdit];
}

type Props = {
    saveScrollState: [(number | undefined), React.Dispatch<React.SetStateAction<number | undefined>>]
}
const MessageSpace = ({saveScrollState: [savedScroll, setScrolledDistance]} : Props) => {
    const state = useLoadMessages();
    const [messageToEdit, setMessageToEdit] = useMessageToEdit();

    if(!state)
        return <></>

    const messagesToView = [...state.messages].reverse();
    return (
        <VolumeProvider>
            <ScrollContainer onScrollToTop={state.loadMessages}
                             savedScrollTop={savedScroll}
                             setScrollTop={setScrolledDistance}
            >
                {messagesToView.map((m, i) =>
                    <MessageView key={m.id} message={new MessageViewModel(m)}
                                 prev={messagesToView[i - 1]}
                                 isEdit={m.id === messageToEdit}
                                 setEdit={(value) => setMessageToEdit(value ? m.id : undefined)}
                    />)}
            </ScrollContainer>
        </VolumeProvider>
    );
};

export default MessageSpace;