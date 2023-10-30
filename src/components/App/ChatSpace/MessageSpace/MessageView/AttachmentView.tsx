import React, {ReactElement, SyntheticEvent, useContext, useEffect, useRef, useState} from 'react';
import Attachment from "../../../../../models/Attachment";
import styles from "./MessageView.module.scss";
import csx from "classnames";
import {AppContext} from "../../../../../Contexts";
import {useVolume} from "../VolumeProvider";
import getMetadata from "../getMetadata";
import EmbedAttachment from "./EmbedAttachment";
import {MetaData} from "../../../../../models/MetaData";

const imagePattern = /\.(png|jpg|jpeg|gif|webp)$/;
const videoPattern = /\.(mp4|avi)$/;
const audioPattern = /\.(mp3|m4a|ogg|wav)$/;
export const mediaPattern = /\.[a-zA-Z0-9]{1,9}$/;

type Props = {
    attachment: Attachment;
}
const AttachmentView = ({attachment}: Props) => {
    const {media} = useContext(AppContext);
    const [isLoaded, setLoaded] = useState(false);
    const [isSpoiler, setSpoiler] = useState(attachment.isSpoiler)
    const ref = useRef<HTMLDivElement>();
    const mediaRef = useRef<HTMLMediaElement>();
    const {volume, setVolume} = useVolume();

    function onVolumeChanged(event: SyntheticEvent<HTMLMediaElement>) {
        setVolume(event.currentTarget.volume);
    }

    useEffect(() => {
        // Update the volume of the media element
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
        }
    }, [volume]);

    let data: ReactElement = <></>
    const lcPath = attachment.path.toLowerCase()

    if (mediaPattern.test(lcPath)) {
        const url = media[attachment.path] as string;
        if (imagePattern.test(lcPath)) {
            data = (<img key={attachment.path} src={url} alt={"attachment"}/>)
        } else if (videoPattern.test(lcPath)) {
            data = (
                <video controls key={attachment.path} src={url} onVolumeChange={onVolumeChanged}
                       ref={mediaRef as any}/>)
        } else if (audioPattern.test(lcPath)) {
            data = (
                <audio controls key={attachment.path} src={url} onVolumeChange={onVolumeChanged}
                       ref={mediaRef as any}/>
            )
        } else {
            //TODO: override for generic files
        }
    } else {
        const metadata = media[attachment.path] as MetaData
        if (metadata) {
            data = (<EmbedAttachment metadata={metadata}/>)
        }
    }

    return (
        <div className={styles.attachment} onClick={() => setSpoiler(false)}>
            <div
                className={csx(styles.mediaContainer, {[styles.spoiler]: isSpoiler})}
                ref={ref as any}>
                {data}
            </div>
        </div>
    );
};

export default AttachmentView;