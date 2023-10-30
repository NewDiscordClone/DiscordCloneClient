import Message from "../../models/Message";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Contexts";
import attachment from "../../models/Attachment";
import {ActionType, MediaDictionary} from "./reducer";
import {mediaPattern} from "./ChatSpace/MessageSpace/MessageView/AttachmentView";
import modifyProxyUrl from "./ChatSpace/MessageSpace/modifyProxyUrl";
import getMetadata from "./ChatSpace/MessageSpace/getMetadata";

/**
 * Hook responsible for saving links to media blobs, so attachments don't need to be loaded every time they are shown
 * @param messages messages to get media from
 * @returns is messages loaded
 */
export function useSaveMedia(messages: (Message[]) | undefined): boolean {
    const [isLoaded, setLoaded] = useState<boolean>(false);
    const {getData, dispatch, media} = useContext(AppContext);

    useEffect(() => {
        if(!messages) return;
        setLoaded(false);
        const list: attachment[] = [];

        // console.log(messages)
        for (const message of messages) {
            for (const attachment of message.attachments) {
                if (media[attachment.path] === undefined) {
                    list.push(attachment)
                }
            }
        }

        // console.log(list)
        async function load(): Promise<MediaDictionary | null> {
            if (list.length === 0) return null;
            const dic: MediaDictionary = {};
            for (const attachment of list) {
                if (mediaPattern.test(attachment.path.toLowerCase()))
                    if (attachment.isInText)
                        dic[attachment.path] = await getData.media.getMedia(modifyProxyUrl(attachment.path));
                    else
                        dic[attachment.path] = await getData.media.getMedia(attachment.path);
                else {
                    const metadata = await getMetadata(attachment.path)
                    dic[attachment.path] = metadata;
                    if (metadata?.image) {
                        dic[metadata.image] = await getData.media.getMedia(modifyProxyUrl(metadata.image));
                    }
                }
            }
            // console.log(dic)
            return dic;
        }

        load().then(dic => {
            // console.log("medial loaded")
            // console.log(messages)
            // console.log(isLoaded)
            setLoaded(true);
            if (dic)
                dispatch({
                    type: ActionType.SaveMedia,
                    value: dic,
                });
        })
    }, [messages])
    return isLoaded;
}