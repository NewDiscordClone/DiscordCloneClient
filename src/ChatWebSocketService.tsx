import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class ChatWebsocketService {
    private _connection: HubConnection;
    private readonly url: string = "https://localhost:7060/chat";

    constructor() {
        // create Connection
        this._connection = new HubConnectionBuilder()
            .withUrl(this.url, {
                accessTokenFactory: () => localStorage.getItem('token') + '',
             //   skipNegotiation: true,
            //    transport: HttpTransportType.WebSockets,
            })
            .configureLogging(LogLevel.Information)
            .build()
        // start connection
        this._connection.start().catch((err: object) => console.error(err));
    }

    registerMessageAdded(messageAdded: (msg: string) => void) {
        // get nre chat message from the server
        this._connection.on('MessageAdded', (message: string) => {
            messageAdded(message);
        });
    }

    sendMessage(message: string) {
        // send the chat message to the server
        this._connection.invoke('AddMessage', message);
    }

}

const WebsocketService = new ChatWebsocketService();

export default WebsocketService;