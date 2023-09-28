import {ClientBase} from "./ClientBase";
import {UserDetails} from "../models/UserDetails";
import {Relationship} from "../models/Relationship";
import Attachment from "../models/Attachment";

export class UsersController extends ClientBase {
    /**
     * Gets detailed information about the provided user, including it's ServerProfile if ServerId is provided
     * @param userId (optional) Id of requested user. If null will return current user
     * @param serverId (optional) string ObjectId represents of server. Can be provided if ServerProfile is required. Null by default
     * @return Ok. User details object in JSON
     */
    getUser(userId?: string, serverId?: string): Promise<UserDetails> {
        let url = "/api/users?";
        if (userId !== undefined)
            url += "userId=" + encodeURIComponent("" + userId) + "&";
        if (serverId !== undefined)
            url += "serverId=" + encodeURIComponent("" + serverId) + "&";
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
     * @param body (optional)
     * @return No Content
     */
    sendMessageToUser(body: SendMessageToUserRequest | undefined): Promise<void> {
        let url = "/api/users";
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
     * Gets all relationships of the current user
     * @return Ok. List of current user relationships in JSON
     */
    getRelationships(): Promise<Relationship[]> {
        let url = "/api/users/relationships";
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
     * Sends a friend request to the user with the provided id
     * @param userId (optional) Id of the user to send a friend request to
     * @return No Content. The request was sent successfully
     */
    sendFriendRequest(userId: string): Promise<void> {
        let url = "/api/users/add-friend?";
        url += "userId=" + encodeURIComponent("" + userId) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Accepts a friend request from the user with the provided id
     * @param userId (optional) Id of the user to accept a friend request from
     * @return No Content. The request was accepted successfully
     */
    acceptFriendRequest(userId: string): Promise<void> {
        let url = "/api/users/accept-friend?";
        url += "userId=" + encodeURIComponent("" + userId) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {}
        };

        return this.sendRequest({url, options});
    }

    /**
     * Gets userId from its user name string. Useful for friend requests
     * @param userName (optional) The user name string to find user by
     * @return Ok. User's GUID
     */
    getUserByUserName(userName: string): Promise<UserDetails> {
        let url = "/api/users?";
        url += "userName=" + encodeURIComponent("" + userName) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "Get",
            headers: {}
        };

        return this.sendRequest({url, options});
    }
}
export interface SendMessageToUserRequest {
    /** The unique identifier of the user to send the message to. */
    userId?: string;
    /** The text of the message, May contain links */
    text?: string | undefined;
    /** Optional attachments to include with the message. */
    attachments?: Attachment[] | undefined;
}