import React, {ReactNode, useEffect, useReducer, useState} from 'react';
import {GetServerData} from "../../api/GetServerData";
import reducer, {ActionType, ReducerState} from "./reducer";
import {AppContext, SelectedChatContext} from '../../Contexts';
import {EventP} from "../../Events";
import SetWebsocketListeners from "./SetWebsocketListeners"
import {ClientMethod} from "../../ChatWebSocketService";
import {signinRedirect, signinSilent} from "../../auth/user-service";
import {Console} from "inspector";
import FileUpload from "./FileUpload";

const chatChanged = new EventP<{ oldChat: string | undefined, newChat: string | undefined }>();

const LoadData = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {} as ReducerState)
    const [selectedChatId, setSelectChatId] = useState<string | undefined>(undefined)
    const selectChat = (chatId: string | undefined) => {
        chatChanged.invoke({oldChat: selectedChatId, newChat: chatId})
        setSelectChatId(chatId);
    }

    useEffect(() => {
        function loadInstance(): Promise<void> {
            return ReducerState.loadInstance(new GetServerData("https://localhost:7060"), dispatch).then(state => {
                    dispatch({
                        type: ActionType.ReducerState,
                        value: state
                    })
                }
            )
        }

        loadInstance().catch((e) => {
            console.log(e)
            alert("an error happened, look in the console to see details")
            signinRedirect();
        });

    }, [])

    // console.log(state);
    if (!state || !state.isLoaded) return <h1>Loading...</h1>; //TODO: Замінити на екран завантаження
    return (
        <AppContext.Provider value={state}>
            <SelectedChatContext.Provider value={{selectedChatId, selectChat, chatChanged}}>
                <FileUpload>
                    <SetWebsocketListeners/>
                    {children}
                </FileUpload>
            </SelectedChatContext.Provider>
        </AppContext.Provider>

    );
};


export default LoadData;