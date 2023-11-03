import Message from "../../models/Message";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Contexts";
import attachment from "../../models/Attachment";
import {ActionType, MediaDictionary} from "./reducer";
import {mediaPattern} from "./ChatSpace/MessageSpace/MessageView/AttachmentView";
import modifyProxyUrl from "./ChatSpace/MessageSpace/modifyProxyUrl";
import getMetadata from "./ChatSpace/MessageSpace/getMetadata";
import {MetaData} from "../../models/MetaData";
import {InvitationDetails} from "../../models/InvitationDetails";

/**
 * Hook responsible for saving links to media blobs, so attachments don't need to be loaded every time they are shown
 * @param messages messages to get media from
 * @returns is messages loaded
 */

type Dictionaries = {
    media: MediaDictionary
    metaData: { [url: string]: MetaData | null}
    invitations: { [url: string]: InvitationDetails | null}
}
export function useSaveMedia(messages: (Message[]) | undefined): boolean {
    const [isLoaded, setLoaded] = useState<boolean>(false);
    const {getData, dispatch, media, metaData, invitations} = useContext(AppContext);

    useEffect(() => {
        if(!messages) return;
        setLoaded(false);
        const list: attachment[] = [];

        // console.log(messages)
        for (const message of messages) {
            for (const attachment of message.attachments) {
                if (media[attachment.path] === undefined &&
                    metaData[attachment.path] === undefined &&
                    invitations[attachment.path] === undefined) {
                    list.push(attachment)
                }
            }
        }

        // console.log(list)
        async function load(): Promise<Dictionaries | null> {
            if (list.length === 0) return null;
            const dic: Dictionaries = {
                media: {},
                metaData: {},
                invitations: {},
            };
            for (const attachment of list) {
                if (mediaPattern.test(attachment.path.toLowerCase()))
                    if (attachment.isInText)
                        dic.media[attachment.path] = await getData.media.getMedia(modifyProxyUrl(attachment.path));
                    else
                        dic.media[attachment.path] = await getData.media.getMedia(attachment.path);
                else if (attachment.path.toLowerCase().startsWith(window.location.origin + "/invitation/")) {
                    const parts = attachment.path.split('/');
                    const id = parts[parts.length - 1];
                    try {
                        dic.invitations[attachment.path] = await getData.invitations.getInvitation(id as string)
                    }
                    catch (error) {
                        dic.invitations[attachment.path] = null;
                    }
                }
                else {
                    const metadata = await getMetadata(attachment.path)
                    dic.metaData[attachment.path] = metadata;
                    if (metadata?.image) {
                        dic.media[metadata.image] = await getData.media.getMedia(modifyProxyUrl(metadata.image));
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
            if (dic) {
                if(Object.keys(dic.media).length > 0)
                    dispatch({
                        type: ActionType.SaveMedia,
                        value: dic.media,
                    });
                if(Object.keys(dic.metaData).length > 0)
                    dispatch({
                        type: ActionType.SaveMetaData,
                        value: dic.metaData,
                    });
                if(Object.keys(dic.invitations).length > 0)
                    dispatch({
                        type: ActionType.SaveInvitations,
                        value: dic.invitations,
                    });
            }
        })
    }, [messages])
    return isLoaded;
}