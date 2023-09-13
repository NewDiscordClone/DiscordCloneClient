import React, {useEffect, useReducer, useState} from 'react';
import styles from './App.module.scss';
import WorkColumn from "./WorkColumn";
import ServerColumn from "./Server/ServerColumn";
import {AppContext, SelectedServerContext} from "../../Contexts";
import reducer, {ActionType, ReducerState} from "./reducer";
import ServerLookUp from "../../models/ServerLookUp";
import {EventP} from "../../Events";
import Channel from "../../models/Channel";
import {GetServerData} from "../../api/GetServerData";

const App = () => {
    const [getData, setGetData] = useState<GetServerData>()
    const [state, dispatch] = useReducer(reducer, {} as ReducerState)
    const [selectedServerId, selectServer] = useState<string>();
    const selectedServer = selectedServerId === undefined ? undefined : state.servers.find(c => c.id === selectedServerId);
    const [serverSelected,] = useState<EventP<(ServerLookUp & { selectedChannel: Channel | undefined }) | undefined>>(new EventP())
    useEffect(() => {
        const onSelectServer = (server: (ServerLookUp & { selectedChannel: Channel | undefined }) | undefined) => {
            if (server) {
                const serverToSelect = state.servers.find(c => c.id === server.id) as (ServerLookUp & { selectedChannel: Channel | undefined });
                if (!("channels" in serverToSelect))
                    getData?.getServerDetails(server?.id).then(server => dispatch({
                        type: ActionType.ServerDetails,
                        value: {...serverToSelect, ...server}
                    }))
            }
            selectServer(server?.id);
        }
        setGetData(_ => {
            const newState = new GetServerData("https://localhost:7060");
            window.addEventListener("beforeunload", (e) => {
                newState.websocket.disconnect();
            });
            dispatch({type: ActionType.ReducerState, value: new ReducerState(newState, dispatch)})
            return newState;
        })
        serverSelected.addListener(onSelectServer);
        return () => {
            serverSelected.removeListener(onSelectServer);

        }
    }, [serverSelected])
    if (getData === undefined) return <div/>;
    return (
        <AppContext.Provider value={state}>
            <SelectedServerContext.Provider value={{selectedServer: selectedServer, serverSelected}}>
                <div className={styles.container}>
                    <ServerColumn/>
                    <WorkColumn/>
                </div>
            </SelectedServerContext.Provider>
        </AppContext.Provider>
    );
};

export default App;