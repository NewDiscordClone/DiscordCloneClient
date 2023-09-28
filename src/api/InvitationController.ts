import {ClientBase} from "./ClientBase";
import {InvitationDetails} from "../models/InvitationDetails";

export class InvitationController extends ClientBase{
    /**
     * Gets Invitation details
     * @param id Id of the invitation to get details from
     * @return Ok. Invitation details in JSON
     */
    getInvitation(id: string): Promise<InvitationDetails> {
        let url = "/api/invitations/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url = url.replace("{id}", encodeURIComponent("" + id));
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
     * Create an invitation as a link
     * @param serverId Id of the server to create an invitation for
     * @param body (optional) ```
     includeUser: bool // Show the user that makes this invitation
     expireTime?: Date // Define when the invitation will be expired
     ```
     * @return Success
     */
    invite(serverId: string, body: CreateInvitationRequest | undefined): Promise<string> {
        let url = "/api/servers/{serverId}/invitations/create";
        if (serverId === undefined || serverId === null)
            throw new Error("The parameter 'serverId' must be defined.");
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.sendRequest({url, options})
    }
}
export interface CreateInvitationRequest {
    /** Indicates whether to include user information in the invitation. */
    includeUser?: boolean;
    /** The expiration time of the invitation. (Optional) */
    expireTime?: Date | undefined;
}