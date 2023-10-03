import React, {useContext, useEffect, useState} from "react";
import {AppContext, SelectedChatContext} from "../../Contexts";
import ChatWebsocketService, {ClientMethod} from "../../ChatWebSocketService";
import PrivateChat from "../../models/PrivateChat";
import {ActionType} from "./reducer";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserLookUp} from "../../models/UserLookUp";

const SetWebsocketListeners = () => {
    const {getData, dispatch, user, servers} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const [websocket, setWebSocket] = useState<ChatWebsocketService>();

    useEffect(() => {
        setWebSocket(new ChatWebsocketService());
        return () => {
            websocket?.disconnect();
        }
    }, []) //НЕ МІНЯТИ!!!

    useEffect(() => {
        function disconnect(e: BeforeUnloadEvent){
            e.preventDefault()
            websocket?.disconnect();
        }

        if (websocket) {
            window.addEventListener("beforeunload", disconnect);
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
                const server = servers.find(s => s.id === serverId);
                if(server && server.selectedChannel === channelId) dispatch({
                        type: ActionType.SaveChannel,
                        value: {selectedChannel: undefined, id: server.id as string}
                    }
                )
            });
            websocket.addListener(ClientMethod.UserUpdated,(userLookUp : UserLookUp) => {
                if(userLookUp.id !== user?.id){
                    dispatch({
                        type: ActionType.UpdateUser,
                        value: userLookUp
                    });
                }
                else{
                    getData.users.getUser().then(u => dispatch({
                        type: ActionType.UpdateSelf,
                        value: u
                    }));
                }
            })
            websocket.addListener(ClientMethod.RelationshipsUpdated, list =>
                dispatch({
                    type: ActionType.UpdateRelationships,
                    value: list
                })
            )
            websocket.addListener(ClientMethod.PrivateChatSaved, (c: PrivateChat) =>
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: c
                }));
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) =>
                dispatch({
                    type: ActionType.PrivateChatRemoved,
                    value: chatId
                }));
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) => {
                if (selectedChatId === chatId) selectChat(undefined);
            });

            websocket.addListener(ClientMethod.MessageAdded, (m: Message & { serverId: string | undefined }) => {
                console.log(m);
                dispatch({type: ActionType.AddMessage, value: m})
                //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу (|| scrolledDistance > 0)
                if (selectedChatId !== m.chatId) {
                    console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
                }
            });
            websocket.addListener(ClientMethod.MessageDeleted, (m: any) =>
                dispatch({type: ActionType.RemoveMessage, value: m}));
            websocket.addListener(ClientMethod.MessageUpdated, (m: any) =>
                dispatch({type: ActionType.MessageUpdated, value: m}));
            return () => {
                websocket.removeAllListeners();
                window.removeEventListener("beforeunload", disconnect);
            }
        }
    }, [dispatch, selectChat, selectedChatId, servers, websocket])
    return null;
}
export default SetWebsocketListeners;