import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Message from "./models/Message";

class ChatWebsocketService {
    private _connection: HubConnection;
    private readonly url: string = "https://localhost:7060/chat";

    constructor() {
        // create Connection
        this._connection = new HubConnectionBuilder()
            .withUrl(this.url, {
                accessTokenFactory: () => localStorage.getItem('token') + '',
            })
            .configureLogging(LogLevel.Information)
            .build()
        // start connection
        this._connection.start().catch((err: object) => console.error(err));
    }

    registerMessageAdded(messageAdded: (message: Message) => void) {
        // get nre chat message from the server
        this._connection.on('MessageAdded', (message: Message) => {
            messageAdded(message);
        });
    }

    // sendMessage(message: MessageSend) {
    //     // send the chat message to the server
    //     this._connection.invoke('AddMessage', message);
    // }

}

export default ChatWebsocketService;