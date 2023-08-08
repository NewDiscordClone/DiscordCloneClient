import React, {useEffect, useReducer, useState} from 'react';
import styles from './App.module.scss';
import WorkColumn from "./WorkColumn";
import IGetData from "../../api/IGetData";
import GetHardCodeData from "../../api/GetHardCodeData";
import ServerColumn from "./Server/ServerColumn";
import {AppContext, SelectedServerContext} from "../../Contexts";
import reducer, {ReducerState} from "./reducer";
import ServerLookUp from "../../models/ServerLookUp";
import {EventP} from "../../Events";
import Channel from "../../models/Channel";

const App = () => {
    const [getData, setGetData] = useState<IGetData>()
    const [state, dispatch] = useReducer(reducer, {} as ReducerState)
    const [selectedServerId, selectServer] = useState<number>();
    const selectedServer = selectedServerId === undefined ? undefined : state.servers.find(c => c.id === selectedServerId);
    const [serverSelected,] = useState<EventP<(ServerLookUp & {selectedChannel: Channel}) | undefined>>(new EventP())
    useEffect(() => {
        const onSelectServer = (server: (ServerLookUp & {selectedChannel: Channel}) | undefined) => {
            selectServer(server?.id);
        }
        setGetData(_ => {
            //const newState = new GetServerData("https://localhost:7060");
            const newState = new GetHardCodeData();
            dispatch({type: "ReducerState", value: new ReducerState(newState, dispatch)})
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