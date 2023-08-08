//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.19.0.0 (NJsonSchema v10.9.0.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import {ClientBase} from "./client-base";
import IGetData from "./IGetData";
import Message, {MessageSend} from "../models/Message";
import {User} from "../models/User";
import ServerLookUp from "../models/ServerLookUp";
import PrivateChat from "../models/PrivateChat";
import ChatWebsocketService from "../ChatWebSocketService";
import {EventP} from "../Events";

export class GetServerData extends ClientBase implements IGetData {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private readonly baseUrl: string;
    private _websocketService: ChatWebsocketService;
    private messageReceivedEvent: EventP<Message> = new EventP<Message>();
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super();
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
        this._websocketService = new ChatWebsocketService();
        this._websocketService.registerMessageAdded(this.messageReceivedEvent.invoke);
    }

    get onMessageReceived(): EventP<Message> {
        return this.messageReceivedEvent;
    }

    sendMessage(message: MessageSend): void {
        this._websocketService.sendMessage(message)
    }

    /**
     * @return Success
     */
    getPrivateChats(): Promise<PrivateChat[]> {
        let url_ = this.baseUrl + "/api/Data/GetPrivateChats";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetPrivateChats(_response);
        });
    }

    protected processGetPrivateChats(response: Response): Promise<PrivateChat[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as PrivateChat[];
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PrivateChat[]>(null as any);
    }

    /**
     * @param userId
     * @param serverId (optional)
     * @return Success
     */
    getUser(userId: number, serverId?: number | undefined): Promise<User> {
        let url_ = this.baseUrl + "/api/Data/GetUser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify({userId, serverId});

        let options_: RequestInit = {
            body: content_,
            method: "GET",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetUser(_response);
        });
    }

    protected processGetUser(response: Response): Promise<User> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as User;
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<User>(null as any);
    }

    /**
     * @return Success
     */
    getCurrentUser(): Promise<User> {
        let url_ = this.baseUrl + "/api/Data/GetCurrentUser";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetCurrentUser(_response);
        });
    }

    protected processGetCurrentUser(response: Response): Promise<User> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as User;
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<User>(null as any);
    }

    /**
     * @return Success
     */
    getServers(): Promise<ServerLookUp[]> {
        let url_ = this.baseUrl + "/api/Data/GetServers";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetServers(_response);
        });
    }

    protected processGetServers(response: Response): Promise<ServerLookUp[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as ServerLookUp[];
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ServerLookUp[]>(null as any);
    }

    /**
     * @param chatId
     * @param messagesCount
     * @return Success
     */
    getMessages(chatId: number, messagesCount:number): Promise<Message[]> {
        let url_ = this.baseUrl + "/api/Data/GetMessages";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify({chatId, messagesCount});

        let options_: RequestInit = {
            body: content_,
            method: "GET",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetMessages(_response);
        });
    }

    protected processGetMessages(response: Response): Promise<Message[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as Message[];
                return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Message[]>(null as any);
    }

    /**
     * Get information for testing authorization.
     * @return Returns the test information for authorization.
     */
    testAuth(): Promise<TestDto> {
        let url_ = this.baseUrl + "/api/TestAuth";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processTestAuth(_response);
        });
    }

    protected processTestAuth(response: Response): Promise<TestDto> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
                let result200: any = null;
                result200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as TestDto;
                return result200;
            });
        } else if (status === 401) {
            return response.text().then((_responseText) => {
                let result401: any = null;
                result401 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver) as ProblemDetails;
                return throwException("The client must authenticate itself to get the requested response. The client is not authorized to access the resource.", status, _responseText, _headers, result401);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TestDto>(null as any);
    }
}

export interface ProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;

    [key: string]: any;
}

/** Data model for testing authorization. */
export interface TestDto {
    /** User name. */
    userName?: string | undefined;
    /** Number for testing. */
    number?: number;
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}