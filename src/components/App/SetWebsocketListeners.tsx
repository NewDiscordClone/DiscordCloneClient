import React, {useContext, useEffect, useState} from "react";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../Contexts";
import ChatWebsocketService, {ClientMethod} from "../../ChatWebSocketService";
import PrivateChatLookUp from "../../models/PrivateChatLookUp";
import {ActionType} from "./reducer";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserLookUp} from "../../models/UserLookUp";
import {useSaveMedia} from "./useSaveMedia";

function useOnMessageAdded() : (newMessage: Message & { serverId: string | undefined }) => void {
    const {dispatch} = useContext(AppContext);
    const [newMessage, setNewMessage] = useState<Message & { serverId: string | undefined }>()
    const messageToLoad: Message[] | undefined = newMessage? [newMessage]: undefined;
    // console.log("save Media");
    // console.log(messageToLoad);
    const isLoaded = useSaveMedia(messageToLoad);

    useEffect(() => {
        // console.log("is Loaded changed");
        // console.log(newMessage);
        // console.log(isLoaded);
        if(newMessage !== undefined && isLoaded){
            dispatch({type: ActionType.AddMessage, value: newMessage})
            setNewMessage(undefined);
        }
    }, [isLoaded])

    return setNewMessage;
}

const SetWebsocketListeners = () => {
    const {getData, dispatch, user, servers} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const {selectedServerId, selectServer} = useContext(SelectedServerContext);
    const [websocket, setWebSocket] = useState<ChatWebsocketService>();
    const setNewMessage = useOnMessageAdded();

    useEffect(() => {
        setWebSocket(new ChatWebsocketService());
        return () => {
            websocket?.disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) //НЕ МІНЯТИ!!!

    useEffect(() => {
        function disconnect(e: BeforeUnloadEvent) {
            e.preventDefault()
            websocket?.disconnect();
        }

        if (websocket) {
            window.addEventListener("beforeunload", disconnect);
            websocket.addListener(ClientMethod.MessageAdded, (m: Message & { serverId: string | undefined }) => {
                console.log("set new message: ")
                console.log(m)
                setNewMessage(m)
                // dispatch({type: ActionType.AddMessage, value: m})
                //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу (|| scrolledDistance > 0)
                if (selectedChatId !== m.chatId) {
                    console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
                }
            });
            websocket.addListener(ClientMethod.ChannelCreated, (c: Channel) =>
                dispatch({
                    type: ActionType.ChannelCreated,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelUpdated, (c: Channel) =>
                dispatch({
                    type: ActionType.ChannelUpdated,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelDeleted, (c: any) =>
                dispatch({
                    type: ActionType.ChannelRemoved,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelDeleted, ({serverId, channelId}) => {
                if (selectedChatId === channelId) selectChat(undefined);
                const server = servers[serverId]
                if (server && server.selectedChannel === channelId) dispatch({
                        type: ActionType.SaveChannel,
                        value: {selectedChannel: undefined, id: server.id as string}
                    }
                )
            });
            websocket.addListener(ClientMethod.UserUpdated, (userLookUp: UserLookUp) => {
                if (userLookUp.id !== user?.id) {
                    dispatch({
                        type: ActionType.UpdateUser,
                        value: userLookUp
                    });
                } else {
                    getData.users.getUser().then(u => dispatch({
                        type: ActionType.UpdateSelf,
                        value: u
                    }));
                }
            })
            websocket.addListener(ClientMethod.RelationshipsUpdated, list =>
                dispatch({
                    type: ActionType.UpdateRelationship,
                    value: list
                })
            )
            websocket.addListener(ClientMethod.PrivateChatSaved, (c: PrivateChatLookUp) =>
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: c
                })
            );
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) =>
                dispatch({
                    type: ActionType.PrivateChatRemoved,
                    value: chatId
                }));
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) => {
                if (selectedChatId === chatId) selectChat(undefined);
            });
            websocket.addListener(ClientMethod.MessageDeleted, (m: any) =>
                dispatch({type: ActionType.RemoveMessage, value: m}));
            websocket.addListener(ClientMethod.MessageUpdated, (m: any) =>
                dispatch({type: ActionType.MessageUpdated, value: m}));

            websocket.addListener(ClientMethod.ProfileSaved, (p: any) =>
                dispatch({type: ActionType.ServerProfilesSaved, value: p}))
            websocket.addListener(ClientMethod.ProfileDeleted, (p: any) =>
                dispatch({type: ActionType.ServerProfileRemoved, value: p}))

            websocket.addListener(ClientMethod.ServerUpdated, (s: any) =>
                dispatch({type: ActionType.ServerDetails, value: s}))
            websocket.addListener(ClientMethod.ServerUpdated, (serverId: string) =>{
                if(selectedServerId === serverId)
                    selectServer(undefined);
                dispatch({type: ActionType.ServerDeleted, value: serverId})
            })
            return () => {
                websocket.removeAllListeners();
                window.removeEventListener("beforeunload", disconnect);
            }
        }
    }, [dispatch, getData.users, selectChat, selectedChatId, servers, user?.id, websocket])
    return null;
}
export default SetWebsocketListeners;