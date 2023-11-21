import {GetServerData} from "../../api/GetServerData";
import {PersonalChatLookUp, PrivateChatLookUp} from "../../models/PrivateChatLookUp";
import {ServerLookUp} from "../../models/ServerLookUp";
import {Dispatch, ReactNode} from "react";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserDetails} from "../../models/UserDetails";
import {ServerDetailsDto} from "../../models/ServerDetailsDto";
import {Relationship} from "../../models/Relationship";
import {UserLookUp} from "../../models/UserLookUp";
import {MetaData} from "../../models/MetaData";
import PersonalChatLookupImpl from "../../models/PersonalChatLookupImpl";
import MessageImpl from "../../models/MessageImpl";
import {PrivateChatViewModel} from "../../models/PrivateChatViewModel";
import {ServerProfileLookup} from "../../models/ServerProfileLookup";
import ServerProfileLookupImpl from "../../models/ServerProfileLookupImpl";
import UserDetailsImpl from "../../models/UserDetailsImpl";
import {InvitationDetails} from "../../models/InvitationDetails";
import {Role} from "../../models/Role";

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

export type MediaDictionary = { [url: string]: string | null }

export enum ActionType {
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
    SaveMetaData,
    SaveInvitations,
    ServerProfilesSaved,
    ServerProfileSaved,
    ServerProfileRemoved,
    ServerDeleted,
    DeleteRelationship,
    SetUnreadMessageCount,
    SaveRoles,
    SaveRole,
    DeleteRole,
}

export class ReducerState {
    user: UserDetails = {} as UserDetails;
    privateChats: { [id: string]: PrivateChatLookUp } = {};
    chats: { [id: string]: (Chat & ChatState) } = {};
    servers: { [id: string]: (ServerLookUp & SaveChannel) } = {};
    getData: GetServerData;
    dispatch: Dispatch<Action>;
    relationships: Relationship[] = [];
    users: { [id: string]: UserLookUp } = {};
    profiles: { [id: string]: ServerProfileLookup } = {}
    media: MediaDictionary = {};
    metaData: { [url: string]: MetaData | null } = {}
    invitations: { [url: string]: InvitationDetails | null } = {}
    isLoaded: boolean = false;

    private constructor(getData: GetServerData, dispatch: Dispatch<Action>) {
        this.getData = getData;
        this.dispatch = dispatch;
    }

    static loadInstance = async (getData: GetServerData, dispatch: Dispatch<Action>): Promise<ReducerState> => {
        const state: ReducerState = new ReducerState(getData, dispatch);
        state.user = new UserDetailsImpl(await getData.users.getUser());
        //console.log("user");
        (await getData.privateChats.getAllPrivateChats())
            .map(c => ({...c, messages: []}))
            .forEach(c => {
                let chat: PrivateChatLookUp = {...c, unreadMessagesCount: c.unreadMessagesCount ?? 0};
                if ("userId" in c) {
                    const personal = c as unknown as PersonalChatLookUp;
                    state.users[personal.userId] = {
                        id: personal.userId,
                        avatar: personal.image,
                        displayName: personal.title,
                        status: personal.userStatus,
                        textStatus: personal.userTextStatus,
                    }
                    chat = new PersonalChatLookupImpl({
                        ...personal,
                        unreadMessagesCount: personal.unreadMessagesCount ?? 0
                    }, state.users);
                }

                state.privateChats[c.id] = chat;
            });
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
        state.relationships.forEach(r => state.users[r.user.id] = r.user);
        state.users[state.user.id] = state.user;
        const mediaLinks =
            Object.values(state.users).map(u => u.avatar)
                .concat(Object.values(state.privateChats).map(c => c.image))
                .concat(Object.values(state.servers).map(s => s.image))
                .concat([state.user.avatar]);

        for (const media of mediaLinks) {
            if (media)
                state.media[media] = await getData.media.getMedia(media) || null
        }

        console.log(state);
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
    } else if (action.type === ActionType.MessagesLoaded) {
        const value = action.value as Message[];

        if (value.length <= 0) return state;

        const chats = {...state.chats};
        const users = {...state.users}
        value.forEach(m => {
            const user = m.author;
            if (!user || state.users[user.id]) return;
            state.users[user.id] = user;
        })
        const messages = value.map(m => new MessageImpl(m, users));
        chats[value[0].chatId].messages = [...chats[value[0].chatId].messages, ...messages];
        return {...state, chats, users};

    } else if (action.type === ActionType.ChatState) {
        const value = action.value as (ChatState & { id: string });
        const chats = {...state.chats};
        chats[value.id] = {...chats[value.id], ...value}
        return {...state, chats};
    } else if (action.type === ActionType.AddMessage) {
        const message = action.value as Message;
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};

        const users = {...state.users};
        if (message.author && !users[message.author.id])
            users[message.author.id] = message.author;

        chats[message.chatId].messages = [message, ...chats[message.chatId].messages];
        chats[message.chatId].updatedDate = message.sendTime.toString();
        if (privateChats[message.chatId])
            privateChats[message.chatId].updatedDate = message.sendTime.toString();
        return {...state, chats, privateChats, users};
    } else if (action.type === ActionType.SaveChannel) {
        const value = action.value as (SaveChannel & { id: string });
        const servers = {...state.servers};
        if (servers[value.id])
            servers[value.id].selectedChannel = value.selectedChannel
        return {...state, servers};
    } else if (action.type === ActionType.ServerDetails) {
        const value = action.value as (ServerDetailsDto & SaveChannel);
        const servers = {...state.servers};
        const chats = {...state.chats};
        if (value.channels) {
            value.channels = value.channels.map(c => ({...c, allLoaded: false, messages: []}));
            ;
            value.channels.forEach(c => chats[c.id] = c);
            if (!value.selectedChannel)
                value.selectedChannel = value.channels[0] ?? undefined;
        }
        if (value.image && (!servers[value.id] || servers[value.id].image !== value.image))
            state.getData.media.getMedia(value.image)
                .then(blob => state.dispatch(
                    {
                        type: ActionType.SaveMedia,
                        value: blob
                    }))
        servers[value.id] = {...servers[value.id], ...value};

        return {...state, servers, chats};
    } else if (action.type === ActionType.PrivateChatSaved) {
        const chat = action.value as PrivateChatLookUp;
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};
        privateChats[chat.id] = {
            ...chat,
            unreadMessagesCount: chat.unreadMessagesCount ?? chats[chat.id]?.unreadMessagesCount ?? 0
        };
        chats[chat.id] = {
            ...chat,
            unreadMessagesCount: chat.unreadMessagesCount ?? chats[chat.id]?.unreadMessagesCount ?? 0,
            scrollMessageId: chats[chat.id]?.scrollMessageId ?? undefined,
            allLoaded: chats[chat.id]?.allLoaded ?? undefined,
            messages: chats[chat.id]?.messages ?? []
        }
        if (chat.image) {
            state.getData.media.getMedia(chat.image)
                .then(blob => state.dispatch({
                        type: ActionType.SaveMedia,
                        value: {
                            [chat.image as string]: blob
                        }
                    }
                ))
        }
        if ("profiles" in chat) {
            const users = {...state.users}
            const viewModel = chat as PrivateChatViewModel;
            for (const profile of viewModel.profiles) {
                if (users[profile.userId] && users[profile.userId].displayName === profile.name) continue;
                users[profile.userId] = {
                    id: profile.userId,
                    displayName: profile.name,
                    avatar: profile.avatarUrl,
                    status: profile.status,
                    textStatus: profile.textStatus
                }
            }
            return {...state, chats, privateChats, users}
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
        (servers as unknown as { [id: string]: { channels: Channel[] } })[channel.serverId].channels.push(channel);
        chats[channel.id] = {...channel, messages: [], allLoaded: false}
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelUpdated) {
        const channel = action.value as Channel;
        const chats = {...state.chats}
        const servers = {...state.servers as { [id: string]: ServerLookUp & SaveChannel & { channels: Channel[] } }}
        if (!channel.serverId || !servers[channel.serverId].channels) return state;
        const scIndex = servers[channel.serverId].channels.findIndex(c => c.id === channel.id);
        servers[channel.serverId].channels[scIndex] = channel;
        chats[channel.id] = {...chats[channel.id], ...channel};
        return {...state, chats, servers};
    } else if (action.type === ActionType.ChannelRemoved) {
        const value = action.value as { serverId: string, channelId: string };
        const chats = {...state.chats};
        const servers = {...state.servers as { [id: string]: ServerLookUp & SaveChannel & { channels: Channel[] } }};
        if (!value.serverId || !servers[value.serverId].channels) return state;
        const scIndex = servers[value.serverId].channels.findIndex(c => c.id === value.channelId);
        servers[value.serverId].channels.splice(scIndex, 1);
        delete chats[value.channelId]
        return {...state, chats, servers};
    } else if (action.type === ActionType.UpdateSelf) {
        const user = action.value as UserDetails;
        const users = {...state.users};
        users[user.id] = new UserDetailsImpl(user);
        if (user.avatar && state.user.avatar !== user.avatar)
            state.getData.media.getMedia(user.avatar)
                .then(url => state.dispatch({
                    type: ActionType.SaveMedia,
                    value: {[user.avatar as string]: url}
                }))
        return {...state, user, users};
    } else if (action.type === ActionType.UpdateUser) {
        const user = action.value as UserLookUp & { userName: string };
        const relationships = state.relationships.map(r => r);
        const users = {...state.users};
        if (user.avatar && state.users[user.id].avatar !== user.avatar)
            state.getData.media.getMedia(user.avatar)
                .then(blob => state.dispatch({
                    type: ActionType.SaveMedia,
                    value: {[user.avatar as string]: blob}
                }))
        const index = relationships.findIndex(r => r.user.id === user.id);
        users[user.id] = user;
        relationships[index] = {...relationships[index], user};
        return {...state, relationships, users};
    } else if (action.type === ActionType.UpdateRelationship) {
        const relationship = action.value as Relationship;
        const relationships = [...state.relationships];
        const index = relationships.findIndex(r => r.user.id === relationship.user.id);


        if (index < 0) {
            console.log("added");
            console.log(relationship)
            relationships.unshift(relationship);
        } else {
            console.log("updated")
            console.log(relationship)
            relationships[index] = relationship;
        }

        return {...state, relationships};
    } else if (action.type === ActionType.DeleteRelationship) {
        const user = action.value as { id: string };
        const relationships = [...state.relationships];
        const index = relationships.findIndex(r => r.user.id === user.id);

        if (index < 0) {
            return state;
        } else {
            relationships.splice(index, 1);
        }
        return {...state, relationships};
    } else if (action.type === ActionType.SaveMedia) {
        const value = action.value as MediaDictionary
        const media = {...state.media, ...value}
        return {...state, media}
    } else if (action.type === ActionType.SaveMetaData) {
        const value = action.value as { [url: string]: MetaData }
        const metaData = {...state.metaData, ...value}
        return {...state, metaData}
    } else if (action.type === ActionType.SaveInvitations) {
        const value = action.value as { [url: string]: InvitationDetails }
        const invitations = {...state.invitations, ...value}
        return {...state, invitations}
    } else if (action.type === ActionType.ServerProfilesSaved) {
        const value = action.value as ServerProfileLookup[];
        const profiles = {...state.profiles};
        const users = {...state.users};
        console.log(value);
        for (const profile of value) {
            if (!users[profile.userId]) {
                users[profile.userId] = {
                    id: profile.userId,
                    displayName: profile.name,
                    avatar: profile.avatarUrl,
                    status: profile.status,
                    textStatus: profile.textStatus,
                }
            }
            profiles[profile.id] = new ServerProfileLookupImpl(profile, users);
        }
        return {...state, profiles, users};
    } else if (action.type === ActionType.ServerProfileSaved) {
        const profile = action.value as ServerProfileLookup;
        const profiles = {...state.profiles};
        profiles[profile.id] = new ServerProfileLookupImpl(profile, state.users);

        const users = {...state.users};
        if (!users[profile.userId]) {
            users[profile.userId] = {
                id: profile.userId,
                displayName: profile.name,
                avatar: profile.avatarUrl,
                status: profile.status,
                textStatus: profile.textStatus,
            }
            return {...state, profiles, users};
        }
        return {...state, profiles};
    } else if (action.type === ActionType.ServerProfileRemoved) {
        const profile = action.value as { id: string }
        const profiles = {...state.profiles}
        delete profiles[profile.id];
        return {...state, profiles}
    } else if (action.type === ActionType.ServerDeleted) {
        const serverId = action.value as string;
        const servers = {...state.servers};
        delete servers[serverId];
        return {...state, servers}
    } else if (action.type === ActionType.SetUnreadMessageCount) {
        const value = action.value as { id: string, unreadMessagesCount: number };
        const chats = {...state.chats};
        const privateChats = {...state.privateChats};
        chats[value.id].unreadMessagesCount = value.unreadMessagesCount;
        privateChats[value.id].unreadMessagesCount = value.unreadMessagesCount;
        // console.log(value);
        return {...state, chats, privateChats}
    } else if (action.type === ActionType.SaveRoles) {
        const value = action.value as { id: string, roles: Role[] }
        const servers = {...state.servers};
        (servers[value.id] as any).roles = value.roles;
        return {...state, servers}
    } else if (action.type === ActionType.SaveRole) {
        const role = action.value as Role & { serverId: string }
        const servers = {...state.servers};
        if (
            !servers[role.serverId] ||
            !("roles" in servers[role.serverId]) ||
            servers[role.serverId] === undefined
        )
            return state;
        const index = (servers[role.serverId] as unknown as { roles: Role[] }).roles
            .findIndex(r => r.id === role.id);
        if (index > -1)
            (servers[role.serverId] as unknown as { roles: Role[] }).roles[index] = role;
        else
            (servers[role.serverId] as unknown as { roles: Role[] }).roles.push(role);

        return {...state, servers}
    } else if (action.type === ActionType.DeleteRole) {
        const role = action.value as { id: string, serverId: string }
        const servers = {...state.servers};
        if (!servers[role.serverId] || !("roles" in servers[role.serverId])) return state;
        const index = (servers[role.serverId] as unknown as { roles: Role[] }).roles
            .findIndex(r => r.id === role.id);
        if (index > -1) {
            (servers[role.serverId] as unknown as { roles: Role[] }).roles.splice(index, 1);
        }
        return {...state, servers}
    } else
        return state;
};

export default reducer;