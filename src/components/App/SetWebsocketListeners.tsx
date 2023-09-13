import React, {useContext, useEffect} from "react";
import {AppContext, SelectedChatContext} from "../../Contexts";
import {ClientMethod} from "../../ChatWebSocketService";
import PrivateChat from "../../models/PrivateChat";
import {ActionType} from "./reducer";
import Message from "../../models/Message";

const SetWebsocketListeners = () => {
    const {getData, dispatch} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    useEffect(() => {
        getData.websocket.addListener(ClientMethod.PrivateChatSaved, (c: PrivateChat) =>
            dispatch({
                type: ActionType.PrivateChatSaved,
                value: c
            }));
        getData.websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) =>
            dispatch({
                type: ActionType.PrivateChatRemoved,
                value: chatId
            }));

        getData.websocket.addListener(ClientMethod.MessageAdded, (m: Message & { serverId: string | undefined }) => {
            dispatch({type: ActionType.AddMessage, value: m})
            //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу (|| scrolledDistance > 0)
            if (selectedChatId !== m.chatId) {
                console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
            }
        });
        getData.websocket.addListener(ClientMethod.MessageDeleted, (m: any) =>
            dispatch({type: ActionType.RemoveMessage, value: m}));
        getData.websocket.addListener(ClientMethod.MessageUpdated, (m: any) =>
            dispatch({type: ActionType.MessageUpdated, value: m}));
        return () => {
            getData.websocket.removeAllListeners();
        }
    }, [dispatch, getData?.websocket, selectedChatId])
    return null;
}
export default SetWebsocketListeners;