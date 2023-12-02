import {ClientBase} from "./ClientBase";
import {ServerDetailsDto} from "../models/ServerDetailsDto";

export class ServersController extends ClientBase {
    /**
     * Joins to the server via invitation
     * @param invitationId Id of the invitation to join to the server
     * @return NoContent. Successful operation
     */
    joinServer(invitationId: string): Promise<void> {
        let url = "/api/servers/join/{invitationId}";
        if (invitationId === undefined || invitationId === null)
            throw new Error("The parameter 'invitationId' must be defined.");
        url = url.replace("{invitationId}", encodeURIComponent("" + invitationId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {}
        };

        return this.sendRequest({url, options});
    }


    /**
     * Leave the given server
     * @param serverId Id of the server to leave from
     * @param profileId Id of the user's profile to leave the server</param>
     * @return NoContent. Successful operation
     */
    leaveServer(serverId: string, profileId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/leave";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Gets all Servers the currently authorized user are member of
     * @return List of the server look ups
     */
    getServers(): Promise<GetServerLookupDto[]> {
        let url = "/api/servers";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Gets the detailed information about the given server
     * @param serverId string ObjectId representation of a server to get details of
     * @return Ok. Server details object in JSON
     */
    getServerDetails(serverId: string): Promise<ServerDetailsDto> {
        let url = "/api/servers/{serverId}";
        if (serverId === undefined || serverId === null)
            throw new Error("The parameter 'serverId' must be defined.");
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",

            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Creates new server
     * @param body ```
     title: string // up to 100 characters
     image?: string // URL to the image media file
     ```
     * @return Created. String ObjectId representation of newly created Server
     */
    createServer(body: CreateServerRequest): Promise<string> {
        let url = "/api/servers";
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain",

            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Changes the given server's title or image
     * @param serverId Id of the server to update
     * @param body ```
     title?: string // up to 100 characters
     image?: string // URL to the image media file
     ```
     * @return No Content. Operation is successful
     */
    updateServer(serverId: string, body: UpdateServerRequest): Promise<void> {
        let url = "/api/servers/{serverId}";
        if (serverId === undefined || serverId === null)
            throw new Error("The parameter 'serverId' must be defined.");
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",

            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Deletes the server
     * @param serverId Id of the server to delete
     * @return No Content. Operation is successful
     */
    deleteServer(serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}";
        if (serverId === undefined || serverId === null)
            throw new Error("The parameter 'serverId' must be defined.");
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {}
        };

        return this.sendRequest({url, options});
    }
}

export interface UpdateServerRequest {
    /** Server's name (Optional) */
    title?: string | undefined;
    /** Server's image url (Optional) */
    image?: string | undefined;
}

export interface GetServerLookupDto {
    /** The unique identifier of the server */
    id?: string | undefined;
    /** Server's name */
    title?: string | undefined;
    /** Avatar Url of the Server */
    image?: string | undefined;
}

export interface CreateServerRequest {
    /** New Server's name */
    title: string;
    /** Server image url */
    image?: string | undefined;
    template: number
}