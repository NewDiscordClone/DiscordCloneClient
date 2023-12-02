import {ClientBase} from "./ClientBase";
import {MediaDetails} from "../models/MediaDetails";

export class MediaController extends ClientBase{
    /**
     * Gets a media by it's id
     * @param url Unique id string that represents ObjectId
     <br>If set to true, the result would be Json detailed information of the media
     <br>If set to false, the result would be media content (data in binary) showed accordingly to it's content type
     * @return <br>Ok.
     <br>By default returns the media content in binary and show it accordingly to it's content type
     <br>If the details param is set to true, returns json with the detailed information about the media
     */
    getMedia(url: string): Promise<string> {
        // let newUrl = url;

        // newUrl += "?details=" + encodeURIComponent("" + true) + "&";
        // newUrl = newUrl.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
            }
        };
        return fetch(url, options)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob));

        // return this.sendRequest({url: newUrl, options, addBaseUrl: false});
    }

    getStickers() : Promise<string[]> {
        let url = "/api/media/stickers";

        let options: RequestInit = {
            method: "GET",
            headers: {

            }
        }
        return this.sendRequest({url, options});
    }

    getMediaDetails(url: string): Promise<MediaDetails> {
        let newUrl = url;

        newUrl += "?details=" + encodeURIComponent("" + true) + "&";
        newUrl = newUrl.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
            }
        };
        return this.sendRequest({url: newUrl, options, addBaseUrl:false});
    }

    /**
     * Uploads the media file to the database
     * @return Created. Operation is successful
     */
    uploadMedia(formData: FormData): Promise<string[]> {
        let url = "/api/media/upload";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            body: formData,
            method: "POST",
            headers: {
            }
        };

        return this.sendRequest({url, options});
    }
}