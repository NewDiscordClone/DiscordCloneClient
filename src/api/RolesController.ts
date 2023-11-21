import {ClientBase} from "./ClientBase";
import {Claim, Role} from "../models/Role";

export class RolesController extends ClientBase {
    /**
     * Returns all roles of the server
     * @param serverId Id of the server to get the roles
     * @return OK. List of roles
     */
    getRoles(serverId: string): Promise<Role[]> {
        let url = "/api/servers/{serverId}/roles";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };
        return this.sendRequest({url, options});
    }

    /**
     * Creates new role
     * @param serverId Id of the server to create the role
     * @param body Role details
     * @return Success
     */
    createRole(serverId: string, body: SaveRoleRequest): Promise<string> {
        let url = "/api/servers/{serverId}/roles";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Returns the role details
     * @param roleId Id of the role
     * @param serverId Id of the server to get the role from
     * @return OK. Role details
     */
    getRole(roleId: string, serverId: string): Promise<Role> {
        let url = "/api/servers/{serverId}/roles/{roleId}";
        url = url.replace("{roleId}", encodeURIComponent("" + roleId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Deletes the role
     * @param roleId Id of the role to delete
     * @param serverId Id of the server to delete the role from
     * @return No Content. Operation is successful
     */
    deleteRole(roleId: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/roles/{roleId}";
        url = url.replace("{roleId}", encodeURIComponent("" + roleId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Update role's name.
     * @param roleId ID of the role to update.
     * @param name New role's name.
     * @param serverId Id of the server to update the role in
     * @return Success
     */
    updateRoleName(roleId: string, name: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/roles/{roleId}/name?";
        url = url.replace("{roleId}", encodeURIComponent("" + roleId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url += "name=" + encodeURIComponent("" + name) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Update role's color.
     * @param roleId ID of the role to update.
     * @param color New role's color.
     * @param serverId Id of the server to update the role in
     * @return Success
     */
    updateRoleColor(roleId: string, color: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/roles/{roleId}/color?";
        url = url.replace("{roleId}", encodeURIComponent("" + roleId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url += "color=" + encodeURIComponent("" + color) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Updates the permissions of the role
     * @param roleId Id of the role to update claims
     * @param body New set of claims
     * @param serverId Id of the server to update the role in
     * @return Success
     */
    updateRoleClaims(roleId: string, serverId: string, body: Claim[]): Promise<void> {
        let url = "/api/servers/{serverId}/roles/{roleId}/claims";
        url = url.replace("{roleId}", encodeURIComponent("" + roleId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
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
export interface SaveRoleRequest {
    /** Name of the role */
    name: string | undefined;
    /** Color of the role in hex format */
    color: string | undefined;
    /** Claims of the role */
    claims: Claim[];
}