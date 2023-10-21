import {ClientBase} from "./ClientBase";
import {ServerProfileLookup} from "../models/ServerProfileLookup";

export class ServerProfilesController extends ClientBase {
    /**
     * @return Success
     */
    getServerProfiles(serverId: string): Promise<ServerProfileLookup[]> {
        let url = "/api/servers/{serverId}/profiles";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {}
        };


        return this.sendRequest({url, options});

    }

    /**
     * @return Success
     */
    getServerProfile(profileId: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}";
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {}
        };


        return this.sendRequest({url, options});

    }

    /**
     * Removes User from the server users list. The User can come back if would have an invitation
     * @param serverId Id of the server to kick user from
     * @param profileId Id of the user to kick from the server
     * @return No Content. Operation is successful
     */
    kickUser(serverId: string, profileId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/kick";
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
     * Removes User from the server users list and put him in a black list.
     The User can't come back even if it would have an invitation
     * @param serverId Id of the server to ban user from
     * @param profileId Id of the user to ban
     * @return No Content. Operation is successful
     */
    banUser(serverId: string, profileId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/ban";
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
     * Leave the given server
     * @param serverId Id of the server to leave from
     * @param profileId Id of the user's profile to leave the server
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
     * Removes User from the server's black list. Now the user could return if it would have an invitation
     * @param serverId Id of the server to unban user from
     * @param profileId Id of the user to unban
     * @return No Content. Operation is successful
     */
    unbanUser(serverId: string, profileId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/unban";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {}
        };


        return this.sendRequest({url, options});

    }

    /**
     * Changes the Display name of the server profile
     * @param profileId Id of the user to change the display name
     * @param newName (optional) New display name
     * @param serverId Id of the server to change display name in
     * @return No Content. Operation is successful
     */
    changeServerProfileDisplayName(profileId: string, newName: string | undefined, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/name?";
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url += "newName=" + encodeURIComponent("" + newName) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };


        return this.sendRequest({url, options});

    }

    /**
     * Changes the set of roles of the give user
     * @param profileId Id of the user to change the roles
     * @param serverId Id of the server to change roles in
     * @param body (optional) New set of roles
     * @return No Content. Operation is successful
     */
    changeServerProfileRoles(profileId: string, serverId: string, body: UpdateServerProfileRolesRequest | undefined): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/roles";
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
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
}

/** Request for updating server profile roles */
export interface UpdateServerProfileRolesRequest {
    /** List of roles to be assigned to the user */
    roles?: string[] | undefined;
}
