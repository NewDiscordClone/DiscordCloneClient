import React, {ReactNode, useEffect, useReducer, useState} from 'react';
import {GetServerData} from "../../api/GetServerData";
import reducer, {ActionType, ReducerState} from "./reducer";
import {AppContext, SelectedChatContext, SelectedServerContext} from '../../Contexts';
import {EventP} from "../../Events";
import {signinRedirect, signinSilent} from "../../auth/user-service";
import ContextMenuProvider from "./ContextMenu/ContextMenuProvider";
import SetWebsocketListeners from "./SetWebsocketListeners";

const chatChanged = new EventP<{ oldChat: string | undefined, newChat: string | undefined }>();

const baseUrl: string = process.env.BASE_URL ?? "https://localhost:7060"


const LoadData = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {} as ReducerState)
    const [selectedChatId, setSelectChatId] = useState<string | undefined>(undefined)
    const [selectedServerId, selectServer] = useState<string | undefined>(undefined);
    const selectChat = (chatId: string | undefined) => {
        chatChanged.invoke({oldChat: selectedChatId, newChat: chatId})
        setSelectChatId(chatId);
    }
    // console.log(state)

    useEffect(() => {
        function loadInstance(): Promise<void> {
            return ReducerState.loadInstance(new GetServerData(baseUrl), dispatch).then(state => {
                    dispatch({
                        type: ActionType.ReducerState,
                        value: state
                    })
                }
            )
        }

        loadInstance().catch((e) => {
            console.log(e)
            alert("an error happened, look in the console to see details\n" + e.toString());
            signinSilent().catch(() => signinRedirect());
        });

    }, [])

    // console.log(state);
    if (!state || !state.isLoaded) return <h1>Loading...</h1>; //TODO: Замінити на екран завантаження
    return (
        <AppContext.Provider value={state}>
            <SelectedChatContext.Provider value={{selectedChatId, selectChat, chatChanged}}>
                <SelectedServerContext.Provider value={{selectedServerId, selectServer}}>
                    <ContextMenuProvider>
                        <SetWebsocketListeners/>
                        {children}
                    </ContextMenuProvider>
                </SelectedServerContext.Provider>
            </SelectedChatContext.Provider>
        </AppContext.Provider>
    );
};


export default LoadData;