import IGetData from "./IGetData";
import Chat from "../models/Chat";
import Message, {MessageSend} from "../models/Message";
import {EventP} from "../Events";
import PrivateChat from "../models/PrivateChat";
import Server from "../models/Server";
import User, {UserStatus} from "../models/User";

const message: Message = {
    id: 1,
    sendTime: new Date(2023, 6, 28, 22, 51),
    user: {
        id: 3,
        displayName: "ThirdUser",
        username: "user3",
        avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
        status: UserStatus.online,
        textStatus: null,
    },
    serverProfile: undefined,
    text: "hello, this is message number ",
    attachments: [],
    reactions: []
}

class GetHardCodeData implements IGetData {
    private readonly _pageSize = 25;
    private _messages: Message[] = [];

    constructor() {
        for (let i = 1; i < 200; i++) {
            const text = message.text + i;
            const date = new Date(Number(new Date()) - 3600000 * i);
            this._messages.push({...message, id: i, text: text, sendTime: date});
        }
    }

    async getMessages(chat: Chat, messagesCount: number): Promise<Message[]> {
        const servers = await this.servers();
        const user = await this.user();
        return this._messages.map(m => ({
            ...m,
            text: chat.id + " " + m.text,
            user: `users` in chat?
                (chat as PrivateChat).users[0] :
                servers.find(s => s.channels.find(c => c.id === chat.id) !== undefined)?.users[0] ?? user
        })).slice(messagesCount, messagesCount + this._pageSize);
    }

    private readonly _onMessageReceived: EventP<Message & {chatId: number}> = new EventP<Message & {chatId: number}>();
    get onMessageReceived(): EventP<Message & {chatId: number}> {
        return this._onMessageReceived;
    }

    async privateChats(): Promise<PrivateChat[]> {
        const user = await this.user();
        return [
            {
                id: 1,
                image: undefined,
                title: undefined,
                messages: [],
                users: [
                    {
                        id: 2,
                        displayName: "OtherUser",
                        username: "user2",
                        avatarPath: "https://archive.org/download/discordprofilepictures/discordblue.png",
                        status: UserStatus.idle,
                        textStatus: "I'm Good"
                    },
                    user
                ]
            },
            {
                id: 2,
                image: "https://www.seekpng.com/png/detail/967-9676420_group-icon-org2x-group-icon-orange.png",
                title: undefined,
                messages: [],
                users: [
                    {
                        id: 3,
                        displayName: "ThirdUser",
                        username: "user3",
                        avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
                        status: UserStatus.online,
                        textStatus: "Talk to me pls"
                    },
                    {
                        id: 2,
                        displayName: "OtherUser",
                        username: "user2",
                        avatarPath: "https://archive.org/download/discordprofilepictures/discordblue.png",
                        status: UserStatus.offline,
                        textStatus: "I'm Good"
                    },
                    user,
                ]
            }
        ];
    }

    async sendMessage(message: MessageSend) {
        const user = await this.user();
        this._onMessageReceived.invoke(
            {
                ...message,
                id: 201,
                user: user,
                sendTime: new Date(),
                reactions: [],
                serverProfile: undefined
            }
        )
    }

    async servers(): Promise<Server[]> {
        const user = await this.user();
        return [
            {
                id: 1,
                title: "test 1",
                image: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-square2-512.png",
                channels: [
                    {
                        id: 3,
                        title: "основне3",
                        messages: []
                    }
                ],
                roles: [],
                serverProfiles: [],
                users: [
                    user
                ]
            },
            {
                id: 2,
                title: "test 2",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/YouTube_social_red_square_%282017%29.svg/1024px-YouTube_social_red_square_%282017%29.svg.png",
                channels: [
                    {
                        id: 4,
                        title: "основне4",
                        messages: []
                    }
                ],
                roles: [],
                serverProfiles: [],
                users: [
                    user
                ]
            }, {
                id: 3,
                title: "test 3",
                image: "https://cdn4.iconfinder.com/data/icons/miu-square-flat-social/60/whatsapp-square-social-media-512.png",
                channels: [
                    {
                        id: 5,
                        title: "основне5",
                        messages: []
                    }
                ],
                roles: [],
                serverProfiles: [],
                users: [
                    user
                ]
            }, {
                id: 4,
                title: "test 4",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuBDIoeoNCvS8p16czXQThmrIF1a-nPzgSZg&usqp=CAU",
                channels: [
                    {
                        id: 6,
                        title: "основне6",
                        messages: []
                    }
                ],
                roles: [],
                serverProfiles: [],
                users: [
                    user
                ]
            }, {
                id: 5,
                title: "test 5",
                image: "https://archive.org/download/discordprofilepictures/discordred.png",
                channels: [
                    {
                        id: 7,
                        title: "основне7",
                        messages: []
                    }
                ],
                roles: [],
                serverProfiles: [],
                users: [
                    user
                ]
            },
        ];
    }

    private _user: User | undefined;
    async user(): Promise<User> {
        if(this._user) return this._user;
        return {
            id: 1,
            displayName: "IAmUser",
            username: "user1",
            avatarPath: "https://archive.org/download/discordprofilepictures/discordgreen.png",
            status: UserStatus.idle,
            textStatus: "text status"
        };
    }

}

export default GetHardCodeData;