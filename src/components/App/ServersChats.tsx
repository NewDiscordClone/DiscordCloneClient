import React, {useContext, useState} from 'react';
import ServerColumn from "./Server/ServerColumn";
import ChatsListColumn from "./ChatsListColumn/ChatsListColumn";
import Chat from "../../models/Chat";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../Contexts";
import ServerLookUp from "../../models/ServerLookUp";
import Channel from "../../models/Channel";
import {ActionType} from "./reducer";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import {serverClicked} from "../../TestEvents";
import {ApiException} from "../../api/GetServerData";

const ServersChats = () => {
    const {servers, getData, dispatch, privateChats, chats} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const {selectedServerId, selectServer} = useContext(SelectedServerContext);
    const selectedServer = selectedServerId === undefined ? undefined : servers.find(c => c.id === selectedServerId);

    // console.log("update: ");
    // console.log(privateChats.find(c => c.id === selectedChatId));
    // console.log(chats.find(c => c.id === selectedChatId));
    const onServerClick = (serverId: string | undefined) => {
        if (selectedChatId) {
            dispatch({
                type: ActionType.SaveChannel,
                value: {id: selectedServerId, selectedChannel: chats.find(c => c.id === selectedChatId)}
            })
            selectChat(undefined);
        }

        const serverToSelect = servers.find(c => c.id === serverId) as (ServerLookUp & { selectedChannel: Channel | undefined });

        if (serverId && !("channels" in serverToSelect))
            getData.servers.getServerDetails(serverId).then(server => {
                selectChat(server.channels[0].id);
                dispatch({
                    type: ActionType.ServerDetails,
                    value: {...serverToSelect, ...server}
                })
            }).catch((e: ApiException) => {
                console.error(e)
            })

        selectChat(serverToSelect?.selectedChannel?.id as string | undefined);
        selectServer(serverId);
        serverClicked.invoke(serverId);
    }
    const GetChats = (): Chat[] => {
        if (selectedServer) {
            if ("channels" in selectedServer)
                return (selectedServer as unknown as ServerDetailsDto).channels;
            return [];
        }
        return privateChats;
    }
    return (
        <>
            <ServerColumn selectedServer={selectedServerId} onServerClick={onServerClick}/>
            <ChatsListColumn serverId={selectedServerId} chats={GetChats()}/>
        </>
    );
};

export default ServersChats;