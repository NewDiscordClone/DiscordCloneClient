import {ClientBase} from "./ClientBase";

export class ServerProfilesController extends ClientBase{
    /**
     * Removes User from the server users list. The User can come back if would have an invitation
     * @param serverId Id of the server to kick user from
     * @param userId Id of the user to kick from the server
     * @return No Content. Operation is successful
     */
    kickUser(serverId: string, userId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{userId}/kick";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{userId}", encodeURIComponent("" + userId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Removes User from the server users list and put him in a black list.
     The User can't come back even if it would have an invitation
     * @param serverId Id of the server to ban user from
     * @param userId Id of the user to ban
     * @return No Content. Operation is successful
     */
    banUser(serverId: string, userId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{userId}/ban";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{userId}", encodeURIComponent("" + userId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }


    /**
     * Removes User from the server's black list. Now the user could return if it would have an invitation
     * @param serverId Id of the server to unban user from
     * @param userId Id of the user to unban
     * @return No Content. Operation is successful
     */
    unbanUser(serverId: string, userId: string): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{userId}/unban";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{userId}", encodeURIComponent("" + userId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }


    /**
     * Changes the Display name of the server profile
     * @param serverId Id of the server to change the display name
     * @param profileId Id of the user to change the display name
     * @param newName (optional) New display name
     * @return No Content. Operation is successful
     */
    changeServerProfileDisplayName(serverId: string, profileId: string, newName: string | undefined): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{profileId}/name?";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{profileId}", encodeURIComponent("" + profileId));
        url += "newName=" + encodeURIComponent("" + newName) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }


    /**
     * Changes the set of roles of the give user
     * @param serverId Id of the server to change the roles
     * @param userId Id of the user to change the roles
     * @param body (optional) New set of roles
     * @return No Content. Operation is successful
     */
    changeServerProfileRoles(serverId: string, userId: string, body: UpdateServerProfileRolesRequest | undefined): Promise<void> {
        let url = "/api/servers/{serverId}/profiles/{userId}/roles";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace("{userId}", encodeURIComponent("" + userId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "PATCH",
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