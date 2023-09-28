import {ClientBase} from "./ClientBase";
import Message from "../models/Message";
import Attachment from "../models/Attachment";

export class MessagesController extends ClientBase {
    /**
     * Returns a list of messages to show in the chat
     * @param chatId string ObjectId representation of the chat to get pinned messages from
     * @param messagesCount (optional) The amount of messages that already loaded to skip them. Set 0 to load last messages
     * @param onlyPinned (optional) If true, only pinned messages will be returned
     * @return Ok. A list of messages to show
     */
    getMessages(chatId: string, messagesCount: number, onlyPinned: boolean = false): Promise<Message[]> {
        let url = "/api/chats/{chatId}/messages?";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "messagesCount=" + encodeURIComponent("" + messagesCount) + "&";
        if (onlyPinned)
            url += "onlyPinned=" + encodeURIComponent("" + onlyPinned) + "&";
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
     * Adds message to the given chat and notify other members about it
     * @param chatId string ObjectId representation of the chat to send message to
     * @param body (optional) ```
     text: string // Up to 2000 characters
     attachments: Attachment[] // Attachments that user includes to the message
     ```
     * @return Created. Message added
     */
    addMessage(chatId: string, body: AddMessageRequest | undefined): Promise<void> {
        let url = "/api/chats/{chatId}/messages";
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Adds reaction to the message
     * @param reaction Emoji code
     * @param messageId string ObjectId representation of the message to add reaction to
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    addReaction(messageId: string, reaction: string, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/reactions/add?";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "reaction=" + encodeURIComponent("" + reaction) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json",
                
            }
        };
        return this.sendRequest({url, options});
    }

    /**
     * A request to change the given message text
     * @param messageId: string ObjectId representation of the message to edit
     * @param chatId: string ObjectId representation of the chat where the message is
     * @param body new text
     * @return No Content. Operation is successful
     */
    editMessage(messageId: string, chatId: string, body: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options: RequestInit = {
            body: content_,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json",
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Pins the selected message to the given chat
     * @param messageId string ObjectId representation of the message to pin
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    pinMessage(messageId: string, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/pin";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Remove all reactions from the given message.
     * @param messageId string ObjectId representation of the message to remove reactions from
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    removeAllReactions(messageId: string, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/reactions/remove-all";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Remove a selected attachment from the given message
     * @param messageId string ObjectId representation of the message to remove the attachment from
     * @param attachmentIndex the index of the attachment to remove
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    removeAttachment(messageId: string, attachmentIndex: number, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/attachments?";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "attachmentIndex=" + encodeURIComponent("" + attachmentIndex) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Removes the given message with its attachments and reactions
     * @param messageId string ObjectId representation of the message to remove
     * @param chatId string ObjectId representation of the message to remove
     * @return No Content. Operation is successful
     */
    removeMessage(messageId: string, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }
    /**
     * Remove the given reaction you have added
     * @param messageId string ObjectId representation of the message to remove the reaction from
     * @param reactionIndex the index of the reaction to remove
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    removeReaction(messageId: string, reactionIndex: number, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/reactions/remove?";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url += "reactionIndex=" + encodeURIComponent("" + reactionIndex) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * Unpin previously pinned message
     * @param messageId string ObjectId representation of the message to unpin
     * @param chatId string ObjectId representation of the chat where the message is
     * @return No Content. Operation is successful
     */
    unpinMessage(messageId: string, chatId: string): Promise<void> {
        let url = "/api/chats/{chatId}/messages/{messageId}/unpin";
        url = url.replace("{messageId}", encodeURIComponent("" + messageId));
        url = url.replace("{chatId}", encodeURIComponent("" + chatId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {
                
            }
        };

        return this.sendRequest({url, options})
    }
}

export interface AddMessageRequest {
    /** Text of the message. Can include links */
    text?: string | undefined;
    /** Id of the chat to send message to */
    attachments?: Attachment[] | undefined;
}
export interface SendMessageToUserRequest {
    /** The unique identifier of the user to send the message to. */
    userId?: string;
    /** The text of the message, May contain links */
    text?: string | undefined;
    /** Optional attachments to include with the message. */
    attachments?: Attachment[] | undefined;
}