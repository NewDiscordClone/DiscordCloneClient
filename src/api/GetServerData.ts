import IGetData from "./IGetData";
import Chat from "../models/Chat";
import Message, {MessageSend} from "../models/Message";
import PrivateChat from "../models/PrivateChat";
import Server from "../models/Server";
import User from "../models/User";
import {EventP} from "../Events";
import ChatWebsocketService from "../ChatWebSocketService";

class GetServerData implements IGetData {

    private readonly url = "https://localhost:7060/api/Data"
    private _websocketService: ChatWebsocketService;
    private messageReceivedEvent: EventP<Message & { chatId: number }> = new EventP<Message & { chatId: number }>();

    constructor() {
        this._websocketService = new ChatWebsocketService();
        this._websocketService.registerMessageAdded(this.messageReceivedEvent.invoke);
    }

    get onMessageReceived(): EventP<Message> {
        return this.messageReceivedEvent;
    }

    sendMessage(message: MessageSend): void {
        this._websocketService.sendMessage(message)
    }

    getMessages(chat: Chat, messagesCount: number): Promise<Message[]> {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}, //Cюди можна додати токен
            body: JSON.stringify({chatId: chat.id, messagesCount})
        };
        return fetch(this.url + "/GetMessages", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response.json();
            })
    }

    privateChats(): Promise<PrivateChat[]> {
        const requestOptions = {
            method: 'GET',
            //headers: {'': ''} //Cюди можна додати токен
        };
        return fetch(this.url + "/GetPrivateChats", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response.json();
            })
    }

    servers(): Promise<Server[]> {
        const requestOptions = {
            method: 'GET',
            //headers: {'': ''} //Cюди можна додати токен
        };
        return fetch(this.url + "/GetServers", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response.json();
            })
    }

    user(): Promise<User> {
        const requestOptions = {
            method: 'GET',
            //headers: {'': ''} //Cюди можна додати токен
        };
        return fetch(this.url + "/GetUser", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response.json();
            })
    }

}

export default GetServerData;