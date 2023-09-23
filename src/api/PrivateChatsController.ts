import {ClientBase} from "./ClientBase";
import {GroupChat} from "../models/GroupChat";
import {CreateGroupChatRequest, RemoveGroupChatMemberRequest} from "./GetServerData";
import PrivateChat from "../models/PrivateChat";

export class PrivateChatsController extends ClientBase {
    /**
     * Gets all Private Chats the currently authorized user are member of
     * @return Ok. List of the private chat lookups
     */
    getAllPrivateChats(): Promise<PrivateChat[]> {
        let url = "/api/private-chats";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",

            }
        };

        return this.sendRequest({url, options})
    }

    /**
     * Get details about the given group chat. The details include Title, Image, OwnerId and Users
     * @param chatId Chat ID to get detailed information from
     * @return Ok. Json group chat object
     */
    getGroupChatDetails(chatId: string): Promise<GroupChat> {
        let url = "/api/private-chats/{chatId}";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",

            }
        };

        return this.sendRequest({url, options})
    }


    /**
     * Creates new group chat
     * @param body (optional) ```
     title: string // up to 100 characters
     image?: string // URL to the image media file
     usersId: number[] // users that are members of the chat from the beginning
     ```
     * @return Created. String representation of an ObjectId of a newly created group chat
     */
    createGroupChat(body: CreateGroupChatRequest): Promise<string> {
        let url = "/api/private-chats";
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

        return this.sendRequest({url, options})
    }

    /**
     * Adds the given user to the group chat as a new member
     * @param chatId Chat Id to add new member to
     * @param userId (optional) Id of the user to add
     * @return No Content. Operation is successful
     */
    addMemberToGroupChat(chatId: string, userId: string): Promise<void> {
        let url = "/api/private-chats/{chatId}/add-member?";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "userId=" + encodeURIComponent("" + userId) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };

        return this.sendRequest({url, options})
    }

    /**
     * Changes image of the given group chat
     * @param chatId Chat Id to change image for
     * @param body URL to the new image
     * @return No Content. Operation is successful
     */
    changeGroupChatImage(chatId: string, body: string): Promise<void> {
        let url = "/api/private-chats/{chatId}/image";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",

            }
        };
        return this.sendRequest({url, options})
    }


    /**
     * Changes the title of the given group chat
     * @param chatId Chat Id to change title for
     * @param name New title of the group chat
     * @return No Content. Operation is successful
     */
    renameGroupChat(chatId: string, name: string): Promise<void> {
        let url = "/api/private-chats/{chatId}/name?";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "name=" + encodeURIComponent("" + name) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };

        return this.sendRequest({url, options})
    }

    /**
     * Remove the currently authorized user from the group chat
     * @param chatId Chat Id to leave from
     * @param silent (optional) By default false; if true, the other chat members will not be notified
     * @return No Content. Operation is successful
     */
    leaveFromGroupChat(chatId: string, silent: boolean = false): Promise<void> {
        let url = "/api/private-chats/{chatId}/leave?";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        if (silent)
            url += "silent=" + encodeURIComponent("" + silent) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {}
        };

        return this.sendRequest({url, options})
    }


    /**
     * Transfer owner rights of the group chat to another member of the chat
     * @param chatId Chat Id to change owner for
     * @param newOwnerId Id of the new owner
     * @return No Content. Operation is successful
     */
    changeGroupChatOwner(chatId: string, newOwnerId: string): Promise<void> {
        let url = "/api/private-chats/{chatId}/change-owner?";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "newOwnerId=" + encodeURIComponent("" + newOwnerId) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {}
        };

        return this.sendRequest({url, options})
    }

    /**
     * Removes the given user from the chat members list
     * @param chatId Chat Id to remove member from
     * @param body ( ```
     memberId: int // Id of the user to remove
     silent: boolean // by default false; if true, the other chat members will not be notified
     ```
     * @return No Content. Operation is successful
     */
    removeGroupChatMember(chatId: string, body: RemoveGroupChatMemberRequest | undefined): Promise<void> {
        let url = "/api/private-chats/{chatId}/kick";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",

            }
        };

        return this.sendRequest({url, options})
    }

}