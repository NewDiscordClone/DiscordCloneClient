import React, {ReactNode, useEffect, useReducer, useState} from 'react';
import {GetServerData} from "../../api/GetServerData";
import reducer, {ActionType, ReducerState} from "./reducer";
import {AppContext, SelectedChatContext} from '../../Contexts';
import {EventP} from "../../Events";
import SetWebsocketListeners from "./SetWebsocketListeners"
import {ClientMethod} from "../../ChatWebSocketService";

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
                state.getData.websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) => {
                    if (selectedChatId === chatId) setSelectChatId(undefined);
                });
                dispatch({
                    type: ActionType.ReducerState,
                    value: state
                })
            }
        );

    }, [selectedChatId])

    if (!state || !state.isLoaded) return <div/>; //TODO: Замінити на екран завантаження
    // console.log(state);
    return (
        <AppContext.Provider value={state}>
            <SelectedChatContext.Provider value={{selectedChatId, selectChat, chatChanged}}>
                <SetWebsocketListeners/>
                {children}
            </SelectedChatContext.Provider>
        </AppContext.Provider>

    );
};


export default LoadData;