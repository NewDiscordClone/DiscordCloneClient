import React, {useContext, useState} from 'react';
import ServerColumn from "./Server/ServerColumn";
import ChatsListColumn from "./ChatsListColumn/ChatsListColumn";
import Chat from "../../models/Chat";
import {AppContext, SelectedChatContext} from "../../Contexts";
import ServerLookUp from "../../models/ServerLookUp";
import Channel from "../../models/Channel";
import {ActionType} from "./reducer";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import {serverClicked} from "../../TestEvents";

const ServersChats = () => {
    const {servers, getData, dispatch, privateChats, chats} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const [selectedServerId, setSelectedServer] = useState<string>();
    const selectedServer = selectedServerId === undefined ? undefined : servers.find(c => c.id === selectedServerId);

    const selectServer = (serverId: string | undefined) => {
        if (selectedServerId && selectedChatId) {
            dispatch({
                type: ActionType.SaveChannel,
                value: {id: selectedServerId, selectedChannel: chats.find(c => c.id === selectedChatId) as Channel}
            })
            selectChat(undefined);
        }

        if (serverId) {
            const serverToSelect = servers.find(c => c.id === serverId) as (ServerLookUp & { selectedChannel: Channel | undefined });
            if (!("channels" in serverToSelect))
                getData.getServerDetails(serverId).then(server => dispatch({
                    type: ActionType.ServerDetails,
                    value: {...serverToSelect, ...server}
                }))
            selectChat(serverToSelect?.selectedChannel?.id as string);
        }
        setSelectedServer(serverId);
        serverClicked.invoke(serverId);
    }
    const GetChats = (): Chat[] => {
        if (selectedServer) {
            if ("channels" in selectedServer)
                return (selectedServer as ServerDetailsDto).channels;
            return [];
        }
        return privateChats;
    }
    return (
        <>
            <ServerColumn selectedServer={selectedServerId} onServerClick={selectServer}/>
            <ChatsListColumn isServer={selectedServerId !== undefined} chats={GetChats()}/>
        </>
    );
};

export default ServersChats;