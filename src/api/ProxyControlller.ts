import {ClientBase} from "./ClientBase";
import {parse} from 'node-html-parser';
import {MetaData} from "../models/MetaData";

const urlPattern = /^((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6})?)\b[-a-zA-Z0-9()@:%_+.~#?&\/=]*)$/;

export class ProxyController extends ClientBase {
    // get(url: string): Promise<Response> {
    //     let proxyUrl = "/proxy?url="+encodeURIComponent("" + url);
    //     let options: RequestInit = {
    //         method: "GET",
    //         headers: {}
    //     };
    //     return this.transformRequest({url: proxyUrl, options}).then(newRequest => window
    //         .fetch(newRequest.url, newRequest.options))
    // }

    getMedia(url: string): Promise<string> {
        let proxyUrl = "/api/proxy/media?url=" + encodeURIComponent("" + url);

        let options: RequestInit = {
            method: "GET",
            headers: {}
        };
        return this.transformRequest({url: proxyUrl, options}).then(newRequest => window
            .fetch(newRequest.url, newRequest.options)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob)));
    }

    async getMetadata(url: string): Promise<MetaData | null> {
        const match = url.match(urlPattern)
        const provider = match ? match[2] || undefined : undefined;
        let response: Response | undefined = undefined

        try {
            let proxyUrl = "/api/proxy?url=" + encodeURIComponent("" + url);
            let options: RequestInit = {
                method: "GET",
                headers: {}
            };
            response = await this.transformRequest({url: proxyUrl, options})
                .then(newRequest => {
                    console.log(newRequest)
                    return window.fetch(newRequest.url, newRequest.options)
                })
        } catch {
        }

        if (!response || !response.ok) {
            return null
        }

        const html = await response.text();
        const root = parse(html); // Parse the HTML

        const title: string | undefined =
            root.querySelector('meta[name="og:title"]')?.attributes.content ??
            root.querySelector('meta[name="twitter:title"]')?.attributes.content ??
            root.querySelector('title')?.text;
        const description: string | undefined =
            root.querySelector('meta[name="og:description"]')?.attributes.content ??
            root.querySelector('meta[name="twitter:description"]')?.attributes.content ??
            root.querySelector('meta[name="description"]')?.attributes.content;

        const image: string | undefined =
            root.querySelector('meta[property="og:image"]')?.attributes.content ??
            root.querySelector('meta[property="twitter:image"]')?.attributes.content

        const siteName: string | undefined =
            root.querySelector('meta[property="og:site_name"]')?.attributes.content

        const themeColor: string | undefined =
            root.querySelector('meta[name="theme-color"]')?.attributes.content

        return {
            url,
            title,
            description,
            image,
            siteName,
            provider,
            themeColor
        };
    }
}