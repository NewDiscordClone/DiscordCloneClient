import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {WebSocketTransport} from "@microsoft/signalr/dist/esm/WebSocketTransport";

export enum ClientMethod
{
    ChannelCreated = "ChannelCreated",
    ChannelUpdated = "ChannelUpdated",
    ChannelDeleted = "ChannelDeleted",
    MessageAdded = "MessageAdded",
    MessageUpdated = "MessageUpdated",
    MessageDeleted = "MessageDeleted",
    PrivateChatCreated = "PrivateChatCreated",
    PrivateChatUpdated = "PrivateChatUpdated",
    ServerUpdated = "ServerUpdated",
    ServerDeleted = "ServerDeleted",
    FriendRequest = "FriendRequest",
    AcceptFriendRequest = "AcceptFriendRequest"
}
class ChatWebsocketService {
    private _connection: HubConnection;
    private readonly url: string = "https://localhost:7060/chat";

    constructor() {
        // create Connection
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

    public disconnect(){
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


    // sendMessage(message: MessageSend) {
    //     // send the chat message to the server
    //     this._connection.invoke('AddMessage', message);
    // }

}

export default ChatWebsocketService;