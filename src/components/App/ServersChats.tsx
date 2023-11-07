import React, {useContext} from 'react';
import ServerColumn from "./Server/ServerColumn";
import ChatsListColumn from "./ChatsListColumn/ChatsListColumn";
import Chat from "../../models/Chat";
import {AppContext, SelectedServerContext} from "../../Contexts";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";

const ServersChats = () => {
    const {servers, privateChats} = useContext(AppContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    const selectedServer = selectedServerId === undefined ? undefined : servers[selectedServerId];


    const GetChats = (): Chat[] => {
        if (selectedServer) {
            if ("channels" in selectedServer)
                return (selectedServer as unknown as ServerDetailsDto).channels;
            return [];
        }
        return Object.values(privateChats);
    }
    return (
        <>
            <ServerColumn selectedServer={selectedServerId}/>
            <ChatsListColumn serverId={selectedServerId} chats={GetChats()}/>
        </>
    );
};

export default ServersChats;