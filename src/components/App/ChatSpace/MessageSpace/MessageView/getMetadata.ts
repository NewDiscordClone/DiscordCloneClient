import {parse} from 'node-html-parser'; // You can use a library like 'node-html-parser'

export type MetaData = {
    url: string
    title: string | undefined,
    description: string | undefined,
    image: string | undefined,
    siteName: string | undefined
    themeColor: string | undefined
    provider: string | undefined
}
const corsProxyURL = 'https://cors-anywhere.herokuapp.com/';
const urlPattern =
    /^((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6})?)\b[-a-zA-Z0-9()@:%_+.~#?&\/=]*)$/;

async function getMetadata(url: string) : Promise<MetaData | null> {
    const match = url.match(urlPattern)
    const provider = match? match[2] || undefined : undefined;
    let response : Response | undefined = undefined

    try {
        response = await fetch(corsProxyURL + url);
    }
    catch {}

    if(!response || !response.ok) {
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

export default getMetadata;