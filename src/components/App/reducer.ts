import {GetServerData} from "../../api/GetServerData";
import {PrivateChat} from "../../models/PrivateChat";
import {ServerLookUp} from "../../models/ServerLookUp";
import {Dispatch} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserDetails} from "../../models/UserDetails";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import {stat} from "fs";
import chat from "../../models/Chat";
import channelChatListItem from "./List/ChannelChatListItem";
import {Relationship} from "../../models/Relationship";
import {UserLookUp} from "../../models/UserLookUp";
import {User} from "oidc-client";

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
    ChannelCreated,
    ChannelUpdated,
    ChannelRemoved,
    UpdateSelf,
    UpdateUser,
    UpdateRelationships
}

export class ReducerState {
    user: UserDetails = {} as UserDetails;
    privateChats: PrivateChat[] = [];
    chats: (Chat & ChatState)[] = [];
    servers: (ServerLookUp & SaveChannel)[] = [];
    getData: GetServerData;
    dispatch: Dispatch<Action>;
    relationships: Relationship[] = [];
    isLoaded: boolean = false;

    private constructor(getData: GetServerData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
    }

    static loadInstance = async (getData: GetServerData, dispatch: Dispatch<Action>): Promise<ReducerState> => {
        const state: ReducerState = new ReducerState(getData, dispatch);
        state.user = await getData.users.getUser();
        //console.log("user");
        state.privateChats = (await getData.privateChats.getAllPrivateChats()).map(c => ({...c, messages: []}));
        //console.log("privateChats");
        state.servers = (await getData.servers.getServers()).map(s => ({...s, selectedChannel: undefined}));
        state.servers.unshift({id: undefined, selectedChannel: undefined});
        //console.log("servers");
        state.chats = state.privateChats.map((c) => ({...c, scroll: 0}))
        for (const server of state.servers) {
            if ("channels" in server) {
                const channels = server.channels as Channel[] | undefined;
                if (!channels) continue;
                state.chats = [...state.chats, ...channels.map((c) => ({...c, scroll: 0}))]
            }
        }
        //console.log("chats")
        state.relationships = await getData.users.getRelationships();
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
        const chats = state.chats.map(c => ({...c}));
        value.channels.forEach(c => {chats.push({...c, scroll: 0, allLoaded: false, messages: []})});
        const index = servers.findIndex(c => c.id === value.id);
        servers[index] = value;
        return {...state, servers, chats};
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
    } else if (action.type === ActionType.ChannelCreated) {
        const channel = action.value as Channel;
        const chats = state.chats.map(c => ({...c}));
        const servers = state.servers.map<ServerLookUp & SaveChannel>(s => ({...s}));
        const sIndex = servers.findIndex(s => s.id === channel.serverId);
        if(sIndex < 0 || !("channels" in servers[sIndex])) return state;
        (servers as unknown as {channels: Channel[]}[])[sIndex].channels.push(channel);
        chats.push({...channel, messages: [], scroll: 0, allLoaded: false});
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelUpdated) {
        const channel = action.value as Channel;
        const chats = state.chats.map(c => ({...c}));
        const servers = state.servers.map<ServerLookUp & SaveChannel & {channels: Channel[]}>(s => ({channels: [], ...s}));
        const sIndex = servers.findIndex(s => s.id === channel.serverId);
        if(sIndex < 0 || servers[sIndex].channels.length <= 0) return state;
        const scIndex = servers[sIndex].channels.findIndex(c => c.id === channel.id);
        servers[sIndex].channels[scIndex] = channel;
        const cIndex = chats.findIndex(c => c.id === channel.id);
        chats[cIndex] = {...chats[cIndex], ...channel};
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelRemoved) {
        const value = action.value as {serverId: string, channelId: string };
        const chats = state.chats.map(c => ({...c}));
        const servers = state.servers.map<ServerLookUp & SaveChannel & {channels: Channel[]}>(s => ({channels: [], ...s}));
        const sIndex = servers.findIndex(s => s.id === value.serverId);
        if(sIndex < 0 || servers[sIndex].channels.length <= 0) return state;
        const scIndex = servers[sIndex].channels.findIndex(c => c.id === value.channelId);
        servers[sIndex].channels.splice(scIndex, 1);
        const cIndex = chats.findIndex(c => c.id === value.channelId);
        chats.splice(cIndex, 1);
        return {...state, chats, servers};
    } else if (action.type === ActionType.UpdateSelf) {
        return {...state, user: action.value as UserDetails};
    } else if (action.type === ActionType.UpdateUser) {
        const user = action.value as UserLookUp;
        const relationships = state.relationships.map(r => r);
        const index = relationships.findIndex(r => r.user.id === user.id);
        relationships[index] = {...relationships[index], user};
        return {...state, relationships};
    } else if (action.type === ActionType.UpdateRelationships) {
        return {...state, relationships: action.value as Relationship[]};
    } else
        return state;
};

export default reducer;