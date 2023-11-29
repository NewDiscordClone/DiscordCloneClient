import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { UserStatus } from "./models/UserDetails";


export enum ClientMethod {
    ChannelCreated = "ChannelCreated",
    ChannelUpdated = "ChannelUpdated",
    ChannelDeleted = "ChannelDeleted",
    MessageAdded = "MessageAdded",
    MessageUpdated = "MessageUpdated",
    MessageDeleted = "MessageDeleted",
    PrivateChatSaved = "PrivateChatSaved",
    PrivateChatRemoved = "PrivateChatRemoved",
    ServerUpdated = "ServerUpdated",
    ServerDeleted = "ServerDeleted",
    RelationshipsUpdated = "RelationshipsUpdated",
    RelationshipsDeleted = "RelationshipsDeleted",
    UserUpdated = "UserUpdated",
    ProfileSaved = "ProfileSaved",
    ProfileDeleted = "ProfileDeleted",
    RoleSaved = "RoleSaved",
    RoleDeleted = "RoleDeleted"
}

class ChatWebsocketService {
    private _connection: HubConnection;
    private readonly baseUrl: string = process.env.REACT_APP_DIRECT_API_URI ?? "https://sparkle.net.ua"
    private readonly url: string = this.baseUrl + "/chat";

    constructor() {
        // create Connection
        // console.log(this.url);
        this._connection = new HubConnectionBuilder()
            .withUrl(this.url, {
                accessTokenFactory: () => localStorage.getItem('token') + '',
                // headers: {
                //     "Authorization": "Bearer " + localStorage.getItem("token")
                // }
            })
            .configureLogging(LogLevel.None)
            .build();
        // start connection
        this._connection.start()//.catch((err: object) => console.error(err));
    }

    public disconnect() {
        this.removeAllListeners();
        this._connection.stop();
    }

    public addListener(method: ClientMethod, action: (arg: any) => void) {
        // get nre chat message from the server
        this._connection.on(method, (arg: any) => {
            action(arg);
        });
    }

    public removeListener(method: ClientMethod) {
        // get nre chat message from the server
        this._connection.off(method);
    }

    public removeAllListeners() {
        for (const method in ClientMethod) {
            this._connection.off(method);
        }
    }

    public ChangeStatus(status: UserStatus): Promise<void> {
        return this._connection.invoke("ChangeStatus", status);
    }

    // sendMessage(message: MessageSend) {
    //     // send the chat message to the server
    //     this._connection.invoke('AddMessage', message);
    // }

}

export default ChatWebsocketService;