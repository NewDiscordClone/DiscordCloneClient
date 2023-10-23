import React, {ReactElement, SyntheticEvent, useContext, useEffect, useRef, useState} from 'react';
import Attachment from "../../../../../models/Attachment";
import styles from "./MessageView.module.scss";
import csx from "classnames";
import {AppContext} from "../../../../../Contexts";
import {useVolume} from "../VolumeProvider";

const imagePattern = /.(png|jpg|jpeg|gif|webp)$/;
const videoPattern = /.(mp4|avi)$/;
const audioPattern = /.(mp3|m4a|ogg|wav)$/;
const AttachmentView = ({attachment}: { attachment: Attachment }) => {
    const {getData} = useContext(AppContext);
    const [data, setData] = useState<ReactElement>();
    const [isLoaded, setLoaded] = useState(false);
    const [isSpoiler, setSpoiler] = useState(attachment.isSpoiler)
    const ref = useRef<HTMLDivElement>();
    const mediaRef = useRef<HTMLMediaElement>();
    const {volume, setVolume} = useVolume();

    useEffect(() => {
        function onVolumeChanged(event: SyntheticEvent<HTMLMediaElement>){
            setVolume(event.currentTarget.volume);
        }

        if (!isLoaded) {

            if (imagePattern.test(attachment.path.toLowerCase()))
                setData(<img key={attachment.path} src={attachment.path} alt={"attachment"}/>);
            if (videoPattern.test(attachment.path.toLowerCase())) {
                setData(<video controls key={attachment.path}/>);
                getData.media.getMedia(attachment.path)
                    .then(url => setData(
                        <video controls key={attachment.path} src={url} onVolumeChange={onVolumeChanged} ref={mediaRef as any}/>
                    ))
            }
            if (audioPattern.test(attachment.path.toLowerCase())) {
                setData(<audio controls preload="auto" key={attachment.path}/>);
                getData.media.getMedia(attachment.path)
                    .then(url => setData(
                        <audio controls key={attachment.path} src={url} onVolumeChange={onVolumeChanged} ref={mediaRef as any}/>
                    ))
            }
        }
        setLoaded(true);
        return () => {
        }
    }, [attachment, getData.media, isLoaded, setVolume])

    useEffect(() => {
        // Update the volume of the media element
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className={styles.attachment} onClick={() => setSpoiler(false)}>
            <div
                className={csx(styles.mediaContainer, {[styles.spoiler]: isSpoiler})}
                ref={ref as any}>
                {data}
                {/*{isSpoiler?*/}
                {/*    <div className={styles.spoilerText}>Spoiler</div>*/}
                {/*    : null}*/}
            </div>
        </div>
    );
};

export default AttachmentView;