import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from "./RightColumn.module.scss"
import styles2 from "./ChatSpace/ChatSpace.module.scss"
import csx from 'classnames'
import List from "../List/List";
import ChatSpace from "./ChatSpace/ChatSpace";
import PrivateChatListItem from "../List/PrivateChatListItem";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import Message from "../../../models/Message";
import IListElement from "../List/IListElement";
import ChannelChatListItem from "../List/ChannelChatListItem";
import Channel from "../../../models/Channel";
import ServerLookUp from "../../../models/ServerLookUp";
import {PrivateChat} from "../../../models/PrivateChat";
import {ServerDetailsDto} from "../../../models/ServerDetailsDto";
import {ClientMethod} from "../../../ChatWebSocketService";
import {ActionType} from "../reducer";

const widthToHide = 1130
const WorkColumn = () => {
    const {getData, chats, privateChats, dispatch} = useContext(AppContext);
    const {selectedServer, serverSelected} = useContext(SelectedServerContext);


    // Function to update the page width in the state
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const updatePageWidth = () => {
        setHideInfo(window.innerWidth < widthToHide)
    };

    const [selectedChatId, selectChat] = useState<string | undefined>(undefined)
    const selectedChat: (Chat & { scroll: number }) | undefined = selectedChatId === undefined ?
        undefined :
        chats.find(c => c.id === selectedChatId)
    const [scrolledDistance, setScrolledDistance] = useState<number>(0);

    const onChatClick = useCallback((chat: string) => {
        if (selectedChatId !== undefined)
            dispatch({type: ActionType.ChatState, value: {id: selectedChatId, scroll: scrolledDistance}})
        setScrolledDistance(chats.find(c => c.id === chat)?.scroll ?? 0);
        selectChat(chat)
    }, [chats, dispatch, scrolledDistance, selectedChatId])

    // useEffect hook to set up the event listener for window resize
    useEffect(() => {
        const addMessage = (m: Message & {serverId: string | undefined}) => {
            dispatch({type: ActionType.AddMessage, value: m})
            //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу
            if (selectedChatId !== m.chatId || scrolledDistance > 0) {
                console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
            }
        }
        const selectServer = (server: (ServerLookUp & { selectedChannel: Channel | undefined}) | undefined) => {
            if (selectedServer !== undefined && selectedChat !== undefined)
                dispatch({
                    type: ActionType.SaveChannel,
                    value: {id: selectedServer.id as string, selectedChannel: selectedChat as unknown as Channel}
                })
            onChatClick(server?.selectedChannel?.id as string);
        }
        // Add event listener to update the page width when the window is resized
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
        getData?.websocket.addListener(ClientMethod.MessageAdded, addMessage);
        getData?.websocket.addListener(ClientMethod.PrivateChatCreated, (c: PrivateChat) => dispatch({type:ActionType.PrivateChatCreated, value: c}));
        serverSelected.addListener(selectServer);
        // Clean up the event listener when the component is unmounted


        return () => {
            serverSelected.removeListener(selectServer);
            getData?.websocket.removeListener(ClientMethod.MessageAdded);
            getData?.websocket.removeListener(ClientMethod.PrivateChatCreated);
            window.removeEventListener('resize', updatePageWidth);
        };
    }, [getData?.websocket, dispatch, scrolledDistance, selectedChatId, onChatClick, selectedChat, selectedServer, serverSelected]);

    const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
    const onLoadMessages = async () => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            try {
                const index = chats.findIndex(c => c.id === selectedChatId);
                //console.log(chats[index].allLoaded);
                if(!chats[index].allLoaded){
                    const newMessages = await getData.getMessages(chats[index].id, chats[index].messages.length)
                    dispatch({type: ActionType.MessagesLoaded, value: newMessages});
                    if(newMessages.length <= 0)
                        dispatch({type: ActionType.ChatState, value: {...chats[index], allLoaded: true}})
                    console.log("loadMessages")
                }
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
            element = new PrivateChatListItem(privateChat);
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
                              privateChats.map(c => getListElement(c)):
                              (selectedServer as unknown as ServerDetailsDto) //TODO: Change to load serverDetails
                              .channels.map(c => getListElement(c))}
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