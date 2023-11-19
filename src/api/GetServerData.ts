import {ChannelsController} from "./ChannelsController";
import {InvitationController} from "./InvitationController";
import {MediaController} from "./MediaController";
import {MessagesController} from "./MessagesController";
import {PrivateChatsController} from "./PrivateChatsController";
import {ServersController} from "./ServersController";
import {ServerProfilesController} from "./ServerProfilesController";
import {UsersController} from "./UsersController";
import {TenorController} from "./TenorController";
import {ProxyController} from "./ProxyControlller";
import {RolesController} from "./RolesController";

export class GetServerData {

    constructor(baseUrl:string) {
        this.channels = new ChannelsController(baseUrl);
        this.invitations = new InvitationController(baseUrl);
        this.media = new MediaController(baseUrl);
        this.messages = new MessagesController(baseUrl);
        this.privateChats = new PrivateChatsController(baseUrl);
        this.servers = new ServersController(baseUrl);
        this.serverProfiles = new ServerProfilesController(baseUrl);
        this.users = new UsersController(baseUrl);
        this.tenor = new TenorController(baseUrl);
        this.proxy = new ProxyController(baseUrl);
        this.roles = new RolesController(baseUrl);
    }
    public channels : ChannelsController;
    public invitations: InvitationController;
    public media: MediaController;
    public messages: MessagesController;
    public privateChats: PrivateChatsController;
    public servers: ServersController;
    public serverProfiles: ServerProfilesController;
    public users: UsersController;
    public tenor: TenorController;
    public proxy: ProxyController;
    public roles: RolesController;
}
export interface ProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;

    [key: string]: any;
}
export class ApiException extends Error {
    override message: string;
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