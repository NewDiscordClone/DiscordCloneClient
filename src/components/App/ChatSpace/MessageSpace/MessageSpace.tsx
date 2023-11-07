import React, {useContext, useEffect, useState} from 'react';
import MessageViewModel from "./MessageView/MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView/MessageView";
import {ActionType, ChatState} from "../../reducer";
import {AppContext, SelectedChatContext} from "../../../../Contexts";
import {VolumeProvider} from "./VolumeProvider";
import Chat from "../../../../models/Chat";
import PrivateChatLookUp from "../../../../models/PrivateChatLookUp";
import {UserDetails} from "../../../../models/UserDetails";
import styles from "./MessageSpace.module.scss"
import ScrollContainer from "./ScrollContainer/ScrollContainer";
import {useSaveMedia} from "../../useSaveMedia";

let isMessagesLoading: boolean = false;

/**
 * Hook responsible for loading messages or retrieving them from memory
 * @returns object with messages and function for loading more messages or undefined if messages is not loaded yet
 */
function useLoadMessages(): { messages: Message[], loadMessages: () => void } | undefined {
    const {selectedChatId} = useContext(SelectedChatContext);
    const {chats, dispatch, getData} = useContext(AppContext);
    if(!selectedChatId) throw new Error("selectedChatId can't be undefined at this point");
    const chat = chats[selectedChatId as string] as (Chat & ChatState);
    const [newMessages, setNewMessages] = useState<Message[] | undefined>(undefined)
    const isLoaded = useSaveMedia(newMessages);

    async function loadMessages() {
        if (!isMessagesLoading) {
            isMessagesLoading = true;
            try {
                if (!chat.allLoaded) {
                    // console.log("getMessages")
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
            // console.log("useEffect loadMessages")
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
    setScrollMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}
const MessageSpace = ({setScrollMessageId}: Props) => {
    const state = useLoadMessages();
    const {selectedChatId} = useContext(SelectedChatContext);
    const {chats, users} = useContext(AppContext);
    if(!selectedChatId) throw new Error("selectedChatId can't be undefined at this point");
    const chat = chats[selectedChatId] as (Chat & ChatState);
    const isPrivateChat = "image" in chat;
    const [messageToEdit, setMessageToEdit] = useMessageToEdit();


    function isinCenter(message: Message, scrollTop: number, offset: number, clientHeight: number){
        const messageElement = document.getElementById(`${message.id}`);
        if (!messageElement) return false;

        const messageTop = messageElement.offsetTop;
        const messageBottom = messageTop + messageElement.clientHeight;

        return messageTop >= scrollTop + offset + clientHeight / 2// && messageBottom <= scrollTop + clientHeight/2 + 60
    }
    function handleScroll(clientHeight: number, scrollTop: number, isOnBottom: boolean) {
        if (!state) return;

        if (isOnBottom) {
            setScrollMessageId(state.messages[0].id);
            // console.log(state.messages[0].id)
        } else {
            let messagesInView = [...state.messages].reverse()

            let offset = 30;
            let anyTrue=false;
            do {
                for (const message of messagesInView) {
                    anyTrue = isinCenter(message,scrollTop, offset, clientHeight);
                    if(anyTrue) break;
                }
                offset -= 30
            } while (!anyTrue)
            messagesInView = messagesInView.filter((message) =>
                isinCenter(message,scrollTop, offset, clientHeight));
            setScrollMessageId(messagesInView[0]?.id ?? undefined);
            // console.log(messagesInView[0].id);
        }
    }

    if (!state)
        return <></>

    const messagesToView = [...state.messages].reverse();
    return (
        <VolumeProvider>
            <ScrollContainer onScrollToTop={state.loadMessages}
                             onScroll={handleScroll}
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
                    <MessageView key={m.id} message={new MessageViewModel(m, users)}
                                 prev={messagesToView[i - 1]}
                                 isEdit={m.id === messageToEdit}
                                 setEdit={(value) => setMessageToEdit(value ? m.id : undefined)}
                    />)}
            </ScrollContainer>
        </VolumeProvider>
    );
};

export default MessageSpace;