import React, {useContext, useEffect, useRef, useState} from 'react';
import MessageViewModel from "./MessageView/MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView/MessageView";
import {ActionType, ChatState} from "../../reducer";
import {AppContext, SelectedChatContext} from "../../../../Contexts";
import {VolumeProvider} from "./VolumeProvider";
import ScrollContainer from "./ScrollContainer/ScrollContainer";
import Chat from "../../../../models/Chat";
import {useSaveMedia} from "../../useSaveMedia";
import chat from "../../../../models/Chat";
import PrivateChatLookUp from "../../../../models/PrivateChatLookUp";
import {UserDetails} from "../../../../models/UserDetails";
import styles from "./MessageSpace.module.scss"

let isMessagesLoading: boolean = false;

/**
 * Hook responsible for loading messages or retrieving them from memory
 * @returns object with messages and function for loading more messages or undefined if messages is not loaded yet
 */
function useLoadMessages(): { messages: Message[], loadMessages: () => void } | undefined {
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
                    if (newMessages.length > 0)
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
        if (chat.messages.length === 0) {
            console.log("useEffect loadMessages")
            loadMessages()
        }
    }, [selectedChatId])
    useEffect(() => {
        if (newMessages !== undefined && isLoaded) {
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

function useMessageToEdit(): [(string | undefined), React.Dispatch<React.SetStateAction<string | undefined>>] {
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
    scrollMessageState: [(string | undefined), React.Dispatch<React.SetStateAction<string | undefined>>]
}
const MessageSpace = ({scrollMessageState: [scrollMessageId, setScrollMessageId]}: Props) => {
    const state = useLoadMessages();
    const {selectedChatId} = useContext(SelectedChatContext);
    const {chats} = useContext(AppContext);
    const chat = chats.find(c => c.id === selectedChatId) as (Chat & ChatState);
    const isPrivateChat = "image" in chat;
    const [messageToEdit, setMessageToEdit] = useMessageToEdit();


    function handleScroll(clientHeight: number, scrollTop: number, isOnBottom: boolean) {
        if (!state) return;

        if (isOnBottom) {
            setScrollMessageId(state.messages[0].id);
            console.log(state.messages[0].id)
        } else {
            const messagesInView = [...state.messages].reverse().filter((message) => {
                const messageElement = document.getElementById(`${message.id}`);
                if (!messageElement) return false;

                const messageTop = messageElement.offsetTop;
                const messageBottom = messageTop + messageElement.clientHeight;

                return messageTop >= scrollTop + 30 + clientHeight / 2// && messageBottom <= scrollTop + clientHeight/2 + 60
            });
            setScrollMessageId(messagesInView[0].id);
            console.log(messagesInView[0].id);
        }
    }

    if (!state)
        return <></>

    const messagesToView = [...state.messages].reverse();
    return (
        <VolumeProvider>
            <ScrollContainer onScrollToTop={state.loadMessages}
                             onScroll={handleScroll}
                             scrollElementId={scrollMessageId}
            >
                <div/>
                {chat.allLoaded &&
					<div className={styles.beginning}>
						<>
                            {isPrivateChat ?
                                <div className={styles.iconContainer}>
                                    <img src={(chat as PrivateChatLookUp)?.image} alt={"chat's icon"}/>
                                </div> :
                                <img src={"icons/channel.svg"} className={styles.channelIcon} alt={"channel icon"}/>
                            }
							<h1>{chat.title}</h1>
							<h2>
                                {
                                    "membersCount" in chat ?
                                        "members: " + (chat.membersCount as number) :
                                        "userDetails" in chat && "@" + (chat.userDetails as UserDetails).username
                                }
							</h2>
							<h3>This is the beginning of
								the {"serverId" in chat ? "channel" : "chat"} {"userStatus" in chat && "with"}
								<b>{chat.title}</b></h3>
						</>
					</div>
                }
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