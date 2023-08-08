import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from "./RightColumn.module.scss"
import styles2 from "./ChatSpace/ChatSpace.module.scss"
import csx from 'classnames'
import List from "../List/List";
import User from "../../../models/User";
import ChatSpace from "./ChatSpace/ChatSpace";
import UserChatListItem from "../List/UserChatListItem";
import GroupChatListItem from "../List/GroupChatListItem";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import Message from "../../../models/Message";
import PrivateChat from "../../../models/PrivateChat";
import IListElement from "../List/IListElement";
import ChannelChatListItem from "../List/ChannelChatListItem";
import Channel from "../../../models/Channel";
import Server from "../../../models/Server";

const widthToHide = 1130
const WorkColumn = () => {
    const {getData, chats, privateChats, user, dispatch} = useContext(AppContext);
    const {selectedServer, serverSelected} = useContext(SelectedServerContext);


    // Function to update the page width in the state
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const updatePageWidth = () => {
        setHideInfo(window.innerWidth < widthToHide)
    };

    const [selectedChatId, selectChat] = useState<number | undefined>(undefined)
    const selectedChat: (Chat & { scroll: number }) | undefined = selectedChatId === undefined ?
        undefined :
        chats.find(c => c.id === selectedChatId)
    const [scrolledDistance, setScrolledDistance] = useState<number>(0);

    const onChatClick = useCallback((chat: number) => {
        if (selectedChatId !== undefined)
            dispatch({type: "SaveScroll", value: {id: selectedChatId, scroll: scrolledDistance}})
        setScrolledDistance(chats.find(c => c.id === chat)?.scroll ?? 0);
        selectChat(chat)
    }, [chats, dispatch, scrolledDistance, selectedChatId])

    // useEffect hook to set up the event listener for window resize
    useEffect(() => {
        const addMessage = (m: Message & { chatId: number }) => {
            dispatch({type: "AddMessage", value: m})
            //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу
            if (selectedChatId !== m.chatId || scrolledDistance > 0) {
                console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
            }
        }
        const selectServer = (server: (Server & { selectedChannel: Channel }) | undefined) => {
            if (selectedServer !== undefined && selectedChat !== undefined)
                dispatch({
                    type: "SaveChannel",
                    value: {id: selectedServer.id as number, selectedChannel: selectedChat as unknown as Channel}
                })
            onChatClick(server?.selectedChannel.id as number);
        }
        // Add event listener to update the page width when the window is resized
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
        getData?.onMessageReceived.addListener(addMessage);
        serverSelected.addListener(selectServer);
        // Clean up the event listener when the component is unmounted


        return () => {
            serverSelected.removeListener(selectServer);
            getData?.onMessageReceived.removeListener(addMessage);
            window.removeEventListener('resize', updatePageWidth);
        };
    }, [getData?.onMessageReceived, dispatch, scrolledDistance, selectedChatId, onChatClick, selectedChat, selectedServer, serverSelected]);

    const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
    const onLoadMessages = async () => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            try {
                const index = chats.findIndex(c => c.id === selectedChatId);
                const newMessages = await getData.getMessages(chats[index], chats[index].messages.length)
                dispatch({type: "MessagesLoaded", value: newMessages});
            } catch (error) {
                console.error(error);
            } finally {
                setMessagesLoading(false);
            }
        }
    }
    const getListElement = (chat: Chat): IListElement => {
        let element: IListElement

        if (selectedServer === undefined) {
            const privateChat = chat as PrivateChat;
            if (privateChat.users.length === 2) {
                element = new UserChatListItem(privateChat, privateChat.users.find(u => u.id !== user?.id) as User);
            } else {
                element = new GroupChatListItem(privateChat);
            }
        } else {
            element = new ChannelChatListItem(chat as Channel);
        }
        element.clickAction = () => onChatClick(element.id);
        if (selectedChatId === chat.id)
            element.isSelected = true;
        return element;
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <List elements=
                          {selectedServer === undefined ?
                              privateChats.map(c => getListElement(c)) :
                              selectedServer.channels.map(c => getListElement(c))}
                />
            </div>
            <div className={csx(styles.middleColumn, styles2.container)}>
                {selectedChat &&
					<SelectedChatContext.Provider value={selectedChat as Chat}>
						<ChatSpace chat={selectedChat} loadMessages={onLoadMessages}
								   scrollState={[scrolledDistance, setScrolledDistance]}
								   listItem={getListElement(selectedChat)}/>
					</SelectedChatContext.Provider>
                }
            </div>
            <div className={csx(styles.rightColumn, {[styles.hide]: hideInfo})}></div>
        </div>
    );
};

export default WorkColumn;