import {GetServerData} from "../../api/GetServerData";
import {PrivateChatLookUp} from "../../models/PrivateChatLookUp";
import {ServerLookUp} from "../../models/ServerLookUp";
import {Dispatch, ReactNode} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserDetails} from "../../models/UserDetails";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import {Relationship, RelationshipType} from "../../models/Relationship";
import {UserLookUp} from "../../models/UserLookUp";
import {MetaData} from "../../models/MetaData";
import {stat} from "fs";

export type ChatState = {
    scrollMessageId?: string;
    allLoaded?: boolean;
    messageToEdit?: string;
    // messagesNode?: ReactNode;
};
export type SaveAttachments = {
    attachmentsNode?: ReactNode;
}
type SaveChannel = {
    selectedChannel: Channel | undefined;
}

export type MediaDictionary = { [url: string]: string | MetaData | null }

export enum ActionType {
    ServerSaved,
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
    UpdateRelationship,
    SaveMedia,
}

export class ReducerState {
    user: UserDetails = {} as UserDetails;
    privateChats: { [id: string]: PrivateChatLookUp } = {};
    chats: { [id: string]: (Chat & ChatState) } = {};
    servers: { [id: string]: (ServerLookUp & SaveChannel) } = {};
    getData: GetServerData;
    dispatch: Dispatch<Action>;
    relationships: Relationship[] = [];
    media: MediaDictionary = {};
    isLoaded: boolean = false;

    private constructor(getData: GetServerData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
    }

    static loadInstance = async (getData: GetServerData, dispatch: Dispatch<Action>): Promise<ReducerState> => {
        const state: ReducerState = new ReducerState(getData, dispatch);
        state.user = await getData.users.getUser();
        //console.log("user");
        (await getData.privateChats.getAllPrivateChats())
            .map(c => ({...c, messages: []}))
            .forEach(c => state.privateChats[c.id] = c);
        //console.log("privateChats");
        (await getData.servers.getServers())
            .map(s => ({...s, selectedChannel: undefined}))
            .forEach(s => state.servers[s.id as string] = s);
        state.servers[""] = {id: "", selectedChannel: undefined};
        //console.log("servers");
        for (const key in state.privateChats) {
            state.chats[key] = state.privateChats[key]
        }
        for (const key in state.servers) {
            if ("channels" in state.servers[key]) {
                const channels = (state.servers[key] as any).channels as Channel[] | undefined;
                if (!channels) continue;
                channels.forEach(c => state.chats[c.id] = c);
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
    } else if (action.type === ActionType.ServerSaved) {
        const server = action.value as ServerLookUp & SaveChannel;
        const servers = {...state.servers};
        servers[server.id as string] = server;
        return {...state, servers};
    } else if (action.type === ActionType.MessagesLoaded) {
        const value = action.value as Message[];
        if (value.length > 0) {
            const chats = {...state.chats};
            chats[value[0].chatId].messages = [...chats[value[0].chatId].messages, ...value];
            return {...state, chats};
        }
        return state;
    } else if (action.type === ActionType.ChatState) {
        const value = action.value as (ChatState & { id: string });
        const chats = {...state.chats};
        chats[value.id] = {...chats[value.id], ...value}
        return {...state, chats};
    } else if (action.type === ActionType.AddMessage) {
        const message = action.value as Message;
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};
        chats[message.chatId].messages = [message, ...chats[message.chatId].messages];
        chats[message.chatId].updatedDate = message.sendTime.toString();
        if (privateChats[message.chatId])
            privateChats[message.chatId].updatedDate = message.sendTime.toString();
        return {...state, chats, privateChats};
    } else if (action.type === ActionType.SaveChannel) {
        const value = action.value as (SaveChannel & { id: string });
        const servers = {...state.servers};
        if(servers[value.id])
            servers[value.id].selectedChannel = value.selectedChannel
        return {...state, servers};
    } else if (action.type === ActionType.ServerDetails) {
        const value = action.value as (ServerDetailsDto & SaveChannel);
        const servers = {...state.servers};
        const chats = {...state.chats};
        value.channels.forEach(c =>
                chats[c.id] = {...c, allLoaded: false, messages: []}
        );
        servers[value.id] = value;
        (servers[value.id] as  ServerDetailsDto & SaveChannel).channels =
            value.channels.map(c => ({...c, allLoaded: false, messages: []}));
        if (!value.selectedChannel)
            servers[value.id].selectedChannel = value.channels[0] ?? undefined;
        return {...state, servers, chats};
    } else if (action.type === ActionType.PrivateChatSaved) {
        const chat = action.value as PrivateChatLookUp;
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};
        if (privateChats[chat.id]) {
            chats[chat.id] = {...chat, messages: []}
            privateChats[chat.id] = chat;
        } else {
            privateChats[chat.id] = chat;
            chats[chat.id] = {
                ...chat,
                scrollMessageId: chats[chat.id].scrollMessageId,
                allLoaded: chats[chat.id].allLoaded,
                messages: chats[chat.id].messages
            };
        }
        return {...state, chats, privateChats};
    } else if (action.type === ActionType.PrivateChatRemoved) {
        const chatId = action.value as string;
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};
        delete chats[chatId];
        delete privateChats[chatId];
        return {...state, chats, privateChats}
    } else if (action.type === ActionType.RemoveMessage) {
        const value = action.value as { chatId: string, messageId: string };
        const chats = {...state.chats}
        const mIndex = chats[value.chatId].messages.findIndex(m => m.id === value.messageId);
        if (mIndex < 0) return state;
        chats[value.chatId].messages.splice(mIndex, 1);
        return {...state, chats}
    } else if (action.type === ActionType.MessageUpdated) {
        const message = action.value as Message;
        const chats = {...state.chats}
        const mIndex = chats[message.chatId].messages.findIndex(m => m.id === message.id);
        if (mIndex < 0) return state;
        chats[message.chatId].messages[mIndex] = {...message, author: chats[message.chatId].messages[mIndex].author};
        return {...state, chats}
    } else if (action.type === ActionType.ChannelCreated) {
        const channel = action.value as Channel;
        const chats = {...state.chats}
        const servers = {...state.servers}
        if (!servers[channel.serverId] || !("channels" in servers[channel.serverId])) return state;
        (servers as unknown as {[id:string]: { channels: Channel[]}})[channel.serverId].channels.push(channel);
        chats[channel.id] = {...channel, messages: [], allLoaded: false}
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelUpdated) {
        const channel = action.value as Channel;
        const chats = {...state.chats}
        const servers = {...state.servers as {[id: string]: ServerLookUp & SaveChannel & { channels: Channel[] }}}
        if (!channel.serverId || !servers[channel.serverId].channels) return state;
        const scIndex = servers[channel.serverId].channels.findIndex(c => c.id === channel.id);
        servers[channel.serverId].channels[scIndex] = channel;
        chats[channel.id] = {...chats[channel.id], ...channel};
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelRemoved) {
        const value = action.value as { serverId: string, channelId: string };
        const chats = {...state.chats};
        const servers = {...state.servers as {[id: string]: ServerLookUp & SaveChannel & { channels: Channel[] }}};
        if (!value.serverId || !servers[value.serverId].channels) return state;
        const scIndex = servers[value.serverId].channels.findIndex(c => c.id === value.channelId);
        servers[value.serverId].channels.splice(scIndex, 1);
        delete chats[value.channelId]
        return {...state, chats, servers};
    } else if (action.type === ActionType.UpdateSelf) {
        return {...state, user: action.value as UserDetails};
    } else if (action.type === ActionType.UpdateUser) {
        const user = action.value as UserLookUp & { userName: string };
        const relationships = state.relationships.map(r => r);
        const index = relationships.findIndex(r => r.user.id === user.id);
        relationships[index] = {...relationships[index], user};
        return {...state, relationships};
    } else if (action.type === ActionType.UpdateRelationship) {
        const relationship = action.value as Relationship;
        const relationships = [...state.relationships];
        const index = relationships.findIndex(r => r.user.id === relationship.user.id);

        if (relationship.type === RelationshipType.DELETED && index < 0) {
            console.log("deleted not found")
            return state;
        }
        if (relationship.type === RelationshipType.DELETED) {
            console.log("deleted")
            console.log(relationship)
            relationships.splice(index, 1);
        } else if (index < 0) {
            console.log("added");
            console.log(relationship)
            relationships.unshift(relationship);
        } else {
            console.log("updated")
            console.log(relationship)
            relationships[index] = relationship;
        }

        return {...state, relationships};
    } else if (action.type === ActionType.SaveMedia) {
        const value = action.value as { [url: string]: string }
        const media = {...state.media, ...value}
        return {...state, media}
    } else
        return state;
};

export default reducer;