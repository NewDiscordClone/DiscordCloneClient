import {ClientBase} from "./ClientBase";

export class TenorController extends ClientBase {
    getCategories(): Promise<Category[]> {
        let url = "/api/tenor/categories";

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",
            }
        };

        return this.sendRequest({url, options})
    }
    featured(next?: string): Promise<Response> {
        let url = "/api/tenor/featured?";
        if(next)
            url += "pos=" + encodeURIComponent("" + next) + "&"
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",
            }
        };

        return this.sendRequest({url, options})
    }

    search(query: string, next?: string): Promise<Response> {
        let url = "/api/tenor/search?";
        url += "q=" + encodeURIComponent("" + query) + "&"
        if(next)
            url += "pos=" + encodeURIComponent("" + next) + "&"
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain",
            }
        };

        return this.sendRequest({url, options})
    }
}

export interface Category {
    searchTerm: string;
    image: string;
    isFeatured: boolean;
}
export interface Response{
    results: GifObject[]
    next: string;
}
export interface GifObject {
    id: string;
    media_formats: MediaObject;
}
export interface MediaObject {
    nanogif: MediaFormat;
    tinygif: MediaFormat;
    gif: MediaFormat;
}
export interface MediaFormat {
    size: number;
    dims: [number, number];
    durations: number;
    url: string;
}