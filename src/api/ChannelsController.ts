import {ClientBase} from "./ClientBase";

export class ChannelsController extends ClientBase {

    /**
     * Create a text channel attached to a server
     * @param serverId Id of the server to attach channel to
     * @param name Name of the channel to be created
     * @return Created
     */
    createChannel(serverId: string, name: string): Promise<string> {
        let url = "/api/servers/{serverId}/channels?";
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url += "name=" + encodeURIComponent("" + name) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.sendRequest({url, options});
    }

    /**
     * A request to set a new title for a provided channel
     * @param serverId Id of the server to rename channel in
     * @param channelId Id of the channel to be renamed
     * @param name New name of the channel
     * @return Operation is successful
     */
    renameChannel(channelId: string, name: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/channels/{channelId}/rename?";
        url = url.replace("{channelId}", encodeURIComponent("" + channelId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url += "name=" + encodeURIComponent("" + name) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json"
            }
        };

        return this.sendRequest({url, options})
    }

    /**
     * A request to remove the provided channel by its id
     * @param serverId Id of the server to remove channel from
     * @param channelId Id of the channel to be removed
     * @return Operation is successful
     */
    removeChannel(channelId: string, serverId: string): Promise<void> {
        let url = "/api/servers/{serverId}/channels/{channelId}/delete";
        url = url.replace("{channelId}", encodeURIComponent("" + channelId));
        url = url.replace("{serverId}", encodeURIComponent("" + serverId));
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json-patch+json"
            }
        };

        return this.sendRequest({url, options});
    }
}