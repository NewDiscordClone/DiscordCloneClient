export class TenorController {
    private readonly apiKey: string = "AIzaSyBYNFPq5V6xgmldbiM3crpKAOpeuhYcouA";
    private readonly limit: number = 10;
    private readonly baseUrl: string = "https://g.tenor.com";
    search(searchTerm: string, next?: string) : Promise<Response> {
        let url = this.baseUrl+ "/v2/search?";
        url += "q=" + encodeURIComponent("" + searchTerm) + "&";
        return this.queryLink(url, next)
    }
    featured(limit?: number, next?: string) : Promise<Response> {
        if(!limit) limit = this.limit;
        let url = this.baseUrl + "/v2/featured?";
        return this.queryLink(url, next, limit);
    }
    categories() : Promise<{searchterm: string; image: string}[]> {
        let url = this.baseUrl + "/v2/categories?";
        url += "key=" + encodeURIComponent(this.apiKey) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
            }
        };

        return fetch(url, options).then(response => response.json()).then(response => response['tags']);
    }

    queryLink(url: string, next?: string, limit?: number) : Promise<Response> {
        if(!limit) limit = this.limit;
        url += "limit=" + encodeURIComponent("" + limit) + "&";
        url += "key=" + encodeURIComponent(this.apiKey) + "&";
        if(next)
            url += "pos=" + encodeURIComponent("" + next) + "&";
        url = url.replace(/[?&]$/, "");

        let options: RequestInit = {
            method: "GET",
            headers: {
            }
        };

        return fetch(url, options).then(response => response.json());
    }
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