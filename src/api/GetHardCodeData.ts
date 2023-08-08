import IGetData from "./IGetData";
import Message, {MessageSend} from "../models/Message";
import {EventP} from "../Events";
import PrivateChat from "../models/PrivateChat";
import ServerLookUp from "../models/ServerLookUp";
import User, {UserStatus} from "../models/User";

const message: Message = {
    id: 1,
    sendTime: new Date(2023, 6, 28, 22, 51),
    user: {
        id: 3,
        displayName: "ThirdUser",
        avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
    },
    chatId: -1,
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

    async getMessages(chatId:number, messagesCount: number): Promise<Message[]> {
        const user = await this.getCurrentUser();
        return this._messages.map(m => ({
            ...m,
            text: chatId + " " + m.text,
            chatId: chatId,
            user: user,
        })).slice(messagesCount, messagesCount + this._pageSize);
    }

    private readonly _onMessageReceived: EventP<Message & {chatId: number}> = new EventP<Message & {chatId: number}>();
    get onMessageReceived(): EventP<Message & {chatId: number}> {
        return this._onMessageReceived;
    }

    async getPrivateChats(): Promise<PrivateChat[]> {
        const user = await this.getCurrentUser();
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
        const user = await this.getCurrentUser();
        this._onMessageReceived.invoke(
            {
                ...message,
                id: 201,
                user: user,
                sendTime: new Date(),
                reactions: []
            }
        )
    }

    async getServers(): Promise<ServerLookUp[]> {
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
                ]
            },
        ];
    }

    private _user: User | undefined;
    async getUser(userId:number, serverId?:number | undefined): Promise<User> {
        if(!this._user) this._user = {
            id: 1,
            displayName: "IAmUser",
            username: "user1",
            avatarPath: "https://archive.org/download/discordprofilepictures/discordgreen.png",
            status: UserStatus.idle,
            textStatus: "text status"
        };
        return this._user
    }

    async getCurrentUser(): Promise<User> {
        if(!this._user) this._user = {
            id: 1,
            displayName: "IAmUser",
            username: "user1",
            avatarPath: "https://archive.org/download/discordprofilepictures/discordgreen.png",
            status: UserStatus.idle,
            textStatus: "text status"
        };
        return this._user
    }

}

export default GetHardCodeData;