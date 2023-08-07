import IGetData from "../../api/IGetData";
import PrivateChat from "../../models/PrivateChat";
import Server from "../../models/Server";
import React, {Dispatch} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import User from "../../models/User";

type SaveScroll = {
    scroll: number;
};
type SaveChannel = {
    selectedChannel: Channel;
}

export class ReducerState {
    user: User | undefined = undefined;
    privateChats: PrivateChat[] = [];
    chats: (Chat & SaveScroll)[] = [];
    servers: (Server & SaveChannel)[] = [];
    getData: IGetData;
    dispatch: Dispatch<Action>;

    constructor(getData: IGetData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
        (async () => {
            this.user = await getData.user();
            // console.log("user");
            this.privateChats = await getData.privateChats();
            // console.log("privateChats");
            this.servers = (await getData.servers()).map(s => ({...s, selectedChannel: s.channels[0]}));
            // console.log("servers");
            this.chats = this.privateChats.map((c) => ({...c, scroll: 0}))
            for (const server of this.servers) {
                this.chats = [...this.chats, ...server.channels.map((c) => ({...c, scroll: 0}))]
            }
            // console.log("chats");
            return {...this}
        })().then((state) => dispatch({type: "ReducerState", value: state}));
    }
}

export type Action = {
    type: "PrivateChat" | "Server" | "ReducerState" | "MessagesLoaded" | "SaveScroll" | "AddMessage" | "SaveChannel",
    value: (Chat & SaveScroll) | (Server & SaveChannel) | ReducerState | { chat: Chat, dispatch: React.Dispatch<Action> } | {chat: Chat, messages: Message[]} | (SaveScroll & { id: number }) | (Message & { chatId: number }) | (SaveChannel & { id: number })
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
        const server = action.value as Server & SaveChannel;
        const servers = state.servers.map(c => ({...c}))
        servers[servers.findIndex(c => c.id === server.id)] = server;
        return {...state, servers};
    } else if (action.type === "MessagesLoaded") {
        const value = action.value as { chat: Chat, messages: Message[]};
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === value.chat.id);
        chats[index].messages = [...chats[index].messages, ...value.messages];
        return {...state, chats: chats};
    } else if (action.type === "SaveScroll") {
        const value = action.value as (SaveScroll & { id: number });
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === value.id);
        chats[index].scroll = value.scroll
        return {...state, chats: chats};
    } else if (action.type === "AddMessage") {
        const message = action.value as Message & { chatId: number };
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === message.chatId);
        chats[index].messages = [message, ...chats[index].messages];
        return {...state, chats: chats};
    } else if (action.type === "SaveChannel") {
        const value = action.value as (SaveChannel & { id: number });
        const servers = state.servers.map(c => ({...c}))
        const index = servers.findIndex(c => c.id === value.id);
        servers[index].selectedChannel = value.selectedChannel
        return {...state, servers: servers};
    } else
        return state;
};

export default reducer;