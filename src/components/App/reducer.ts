import {GetServerData} from "../../api/GetServerData";
import {PrivateChat} from "../../models/PrivateChat";
import {ServerLookUp} from "../../models/ServerLookUp";
import {Dispatch} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserDetails} from "../../models/UserDetails";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";

type SaveScroll = {
    scroll: number;
};
type SaveChannel = {
    selectedChannel: Channel | undefined;
}

export class ReducerState {
    user: UserDetails | undefined = undefined;
    privateChats: PrivateChat[] = [];
    chats: (Chat & SaveScroll)[] = [];
    servers: (ServerLookUp & SaveChannel)[] = [];
    getData: GetServerData;
    dispatch: Dispatch<Action>;

    constructor(getData: GetServerData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
        (async () => {
            this.user = await getData.getCurrentUser();
            // console.log("user");
            this.privateChats = (await getData.getAllPrivateChats()).map(c => ({...c, messages: []}));
            // console.log("privateChats");
            this.servers = (await getData.getServers()).map(s => ({...s, selectedChannel: undefined}));
            // console.log("servers");
            this.chats = this.privateChats.map((c) => ({...c, scroll: 0}))
            for (const server of this.servers) {
                if ("channels" in server) {
                    const channels = server.channels as Channel[] | undefined;
                    if (!channels) continue;
                    this.chats = [...this.chats, ...channels.map((c) => ({...c, scroll: 0}))]
                }
            }
            // console.log("chats");
            return {...this}
        })().then((state) => dispatch({type: "ReducerState", value: state}));
    }
}

export type Action = {
    type: "PrivateChat" | "Server" | "ReducerState" | "MessagesLoaded" | "SaveScroll" | "AddMessage" | "SaveChannel" | "ServerDetails",
    value: (Chat & SaveScroll) | (ServerLookUp & SaveChannel) | ReducerState | Message[] | (SaveScroll & { id: string }) | Message | (SaveChannel & { id: string }) | (ServerDetailsDto & SaveChannel)
};

const reducer = (state: ReducerState, action: Action): ReducerState => {
    if (action.type === "ReducerState") {
        return action.value as ReducerState;
    } else if (action.type === "PrivateChat") {
        const chat = action.value as (PrivateChat & SaveScroll);
        const chats = state.privateChats.map(c => ({...c}))
        chats[chats.findIndex(c => c.id === chat.id)] = chat;
        return {...state, privateChats: chats};
    } else if (action.type === "Server") {
        const server = action.value as ServerLookUp & SaveChannel;
        const servers = state.servers.map(c => ({...c}))
        servers[servers.findIndex(c => c.id === server.id)] = server;
        return {...state, servers};
    } else if (action.type === "MessagesLoaded") {
        const value = action.value as Message[];
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === value[0].chatId);
        chats[index].messages = [...chats[index].messages, ...value];
        return {...state, chats: chats};
    } else if (action.type === "SaveScroll") {
        const value = action.value as (SaveScroll & { id: string });
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === value.id);
        chats[index].scroll = value.scroll
        return {...state, chats: chats};
    } else if (action.type === "AddMessage") {
        const message = action.value as Message;
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === message.chatId);
        chats[index].messages = [message, ...chats[index].messages];
        return {...state, chats: chats};
    } else if (action.type === "SaveChannel") {
        const value = action.value as (SaveChannel & { id: string });
        const servers = state.servers.map(c => ({...c}))
        const index = servers.findIndex(c => c.id === value.id);
        servers[index].selectedChannel = value.selectedChannel
        return {...state, servers: servers};
    } else if (action.type === "ServerDetails"){
        const value = action.value as (ServerDetailsDto & SaveChannel);
        const servers = state.servers.map(c => ({...c}))
        const index = servers.findIndex(c => c.id === value.id);
        servers[index] = value;
        return {...state, servers: servers};
    } else
        return state;
};

export default reducer;