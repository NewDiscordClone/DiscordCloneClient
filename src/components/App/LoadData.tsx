import React, {ReactNode, useContext, useEffect, useReducer, useState} from 'react';
import {GetServerData} from "../../api/GetServerData";
import reducer, {ActionType, ReducerState} from "./reducer";
import {AppContext, SelectedChatContext} from '../../Contexts';
import {ClientMethod} from "../../ChatWebSocketService";
import PrivateChat from "../../models/PrivateChat";
import Message from "../../models/Message";
import {EventP} from "../../Events";

const chatChanged = new EventP<{ oldChat: string | undefined, newChat: string | undefined }>();

const LoadData = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {} as ReducerState)
    const [selectedChatId, setSelectChatId] = useState<string | undefined>(undefined)
    const selectChat = (chatId: string | undefined) => {
        chatChanged.invoke({oldChat: selectedChatId, newChat: chatId})
        setSelectChatId(chatId);
    }

    useEffect(() => {
        ReducerState.loadInstance(new GetServerData("https://localhost:7060"), dispatch).then(state => {
                dispatch({
                    type: ActionType.ReducerState,
                    value: state
                })
            }
        );
    }, [])

    if (!state || !state.isLoaded) return <div/>; //TODO: Замінити на екран завантаження
    console.log(state);
    return (
        <AppContext.Provider value={state}>
            <SelectedChatContext.Provider value={{selectedChatId, selectChat, chatChanged}}>
                <SetWebsocketListeners/>
                {children}
            </SelectedChatContext.Provider>
        </AppContext.Provider>

    );
};

const SetWebsocketListeners = () => {
    const {getData, dispatch} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    useEffect(() => {
        getData?.websocket.addListener(ClientMethod.PrivateChatCreated, (c: PrivateChat) =>
            dispatch({
                type: ActionType.PrivateChatCreated,
                value: c
            }));
        getData?.websocket.addListener(ClientMethod.MessageAdded, (m: Message & { serverId: string | undefined }) => {
            dispatch({type: ActionType.AddMessage, value: m})
            //TODO: Зробити щоб чат не прокручувався якщо користувач не внизу (|| scrolledDistance > 0)
            if (selectedChatId !== m.chatId) {
                console.log("Notification") //TODO: Зробивти повідомлення (Звукове, Додати картинку)
            }
        });
        return () => {
            getData?.websocket.removeListener(ClientMethod.MessageAdded);
            getData?.websocket.removeListener(ClientMethod.PrivateChatCreated);
        }
    }, [dispatch, getData?.websocket, selectedChatId])
    return null;
}

export default LoadData;