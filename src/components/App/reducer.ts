import {GetServerData} from "../../api/GetServerData";
import {PrivateChat} from "../../models/PrivateChat";
import {ServerLookUp} from "../../models/ServerLookUp";
import {Dispatch} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserDetails} from "../../models/UserDetails";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import * as fs from "fs";
import {stat} from "fs";
import ChatSpace from "./ChatSpace/ChatSpace";

type ChatState = {
    scroll: number;
    allLoaded?: boolean;
};
type SaveChannel = {
    selectedChannel: Channel | undefined;
}

export enum ActionType {
    ServerUpdated,
    ReducerState,
    MessagesLoaded,
    ChatState,
    AddMessage,
    SaveChannel,
    ServerDetails,
    PrivateChatSaved,
    RemoveMessage,
    MessageUpdated,
    PrivateChatRemoved,
}

export class ReducerState {
    user: UserDetails | undefined = undefined;
    privateChats: PrivateChat[] = [];
    chats: (Chat & ChatState)[] = [];
    servers: (ServerLookUp & SaveChannel)[] = [];
    getData: GetServerData;
    dispatch: Dispatch<Action>;
    isLoaded: boolean = false;

    private constructor(getData: GetServerData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
    }

    static loadInstance = async (getData: GetServerData, dispatch: Dispatch<Action>): Promise<ReducerState> => {
        const state: ReducerState = new ReducerState(getData, dispatch);
        state.user = await getData.getCurrentUser();
        // console.log("user");
        state.privateChats = (await getData.getAllPrivateChats()).map(c => ({...c, messages: []}));
        // console.log("privateChats");
        state.servers = (await getData.getServers()).map(s => ({...s, selectedChannel: undefined}));
        // console.log("servers");
        state.chats = state.privateChats.map((c) => ({...c, scroll: 0}))
        for (const server of state.servers) {
            if ("channels" in server) {
                const channels = server.channels as Channel[] | undefined;
                if (!channels) continue;
                state.chats = [...state.chats, ...channels.map((c) => ({...c, scroll: 0}))]
            }
        }
        // console.log("chats")
        return state;
    }
}

export type Action = {
    type: ActionType,
    value: any
};

const reducer = (state: ReducerState, action: Action): ReducerState => {
    if (action.type === ActionType.ReducerState) {
        return {...action.value as ReducerState, isLoaded: true};
    } else if (action.type === ActionType.ServerUpdated) {
        const server = action.value as ServerLookUp & SaveChannel;
        const servers = state.servers.map(c => ({...c}))
        servers[servers.findIndex(c => c.id === server.id)] = server;
        return {...state, servers};
    } else if (action.type === ActionType.MessagesLoaded) {
        const value = action.value as Message[];
        if (value.length > 0) {
            const chats = state.chats.map(c => ({...c}))
            const index = chats.findIndex(c => c.id === value[0].chatId);
            chats[index].messages = [...chats[index].messages, ...value];
            return {...state, chats};
        }
        return state;
    } else if (action.type === ActionType.ChatState) {
        const value = action.value as (ChatState & { id: string });
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === value.id);
        chats[index] = {...chats[index], ...value}
        return {...state, chats};
    } else if (action.type === ActionType.AddMessage) {
        const message = action.value as Message;
        const chats = state.chats.map(c => ({...c}))
        const index = chats.findIndex(c => c.id === message.chatId);
        chats[index].messages = [message, ...chats[index].messages];
        return {...state, chats};
    } else if (action.type === ActionType.SaveChannel) {
        const value = action.value as (SaveChannel & { id: string });
        const servers = state.servers.map(c => ({...c}))
        const index = servers.findIndex(c => c.id === value.id);
        servers[index].selectedChannel = value.selectedChannel
        return {...state, servers};
    } else if (action.type === ActionType.ServerDetails) {
        const value = action.value as (ServerDetailsDto & SaveChannel);
        const servers = state.servers.map(c => ({...c}))
        const index = servers.findIndex(c => c.id === value.id);
        servers[index] = value;
        return {...state, servers: servers};
    } else if (action.type === ActionType.PrivateChatSaved) {
        const chat = action.value as PrivateChat;
        const chats = state.chats.map(c => ({...c}));
        const privateChats = state.privateChats.map(c => ({...c}));
        const index = privateChats.findIndex(c => c.id === chat.id);
        if (index < 0) {
            chats.unshift({...chat, scroll: 0, messages: []});
            privateChats.unshift(chat);
        } else {
            const cIndex = chats.findIndex(c => c.id === chat.id);
            privateChats[index] = chat;
            chats[cIndex] = {
                ...chat,
                scroll: chats[cIndex].scroll,
                allLoaded: chats[cIndex].allLoaded,
                messages: chats[cIndex].messages
            };
        }
        return {...state, chats, privateChats};
    } else if (action.type === ActionType.PrivateChatRemoved){
        const chatId = action.value as string;
        const chats = state.chats.map(c => ({...c}));
        const privateChats = state.privateChats.map(c => ({...c}));
        const cIndex = chats.findIndex(c => c.id === chatId);
        const pIndex = privateChats.findIndex(c => c.id === chatId);
        chats.splice(cIndex, 1);
        privateChats.splice(pIndex, 1);
        return {...state, chats, privateChats}
    } else if (action.type === ActionType.RemoveMessage) {
        const value = action.value as { chatId: string, messageId: string };
        const chats = state.chats.map(c => ({...c}));
        const cIndex = chats.findIndex(c => c.id === value.chatId);
        const mIndex = chats[cIndex].messages.findIndex(m => m.id === value.messageId);
        if (mIndex < 0) return state;
        chats[cIndex].messages.splice(mIndex, 1);
        return {...state, chats}
    } else if (action.type === ActionType.MessageUpdated) {
        const value = action.value as Message;
        const chats = state.chats.map(c => ({...c}));
        const cIndex = chats.findIndex(c => c.id === value.chatId);
        const mIndex = chats[cIndex].messages.findIndex(m => m.id === value.id);
        if (mIndex < 0) return state;
        chats[cIndex].messages[mIndex] = value;
        return {...state, chats}
    } else
        return state;
};

export default reducer;