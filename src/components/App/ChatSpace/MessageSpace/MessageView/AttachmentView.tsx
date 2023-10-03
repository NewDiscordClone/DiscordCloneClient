import React, {ReactElement, useEffect, useRef, useState} from 'react';
import Attachment from "../../../../../models/Attachment";
import styles from "./MessageView.module.scss";
import csx from "classnames";

const AttachmentView = ({attachment}: { attachment: Attachment }) => {
    const [data, setData] = useState<ReactElement>();
    const [isLoaded, setLoaded] = useState(false);
    const [isSpoiler, setSpoiler] = useState(attachment.isSpoiler)
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (!isLoaded) {
            if (attachment.path.toLowerCase().endsWith(".png") ||
                attachment.path.toLowerCase().endsWith(".jpg") ||
                attachment.path.toLowerCase().endsWith(".jpeg") ||
                attachment.path.toLowerCase().endsWith(".gif") ||
                attachment.path.toLowerCase().endsWith(".webp"))
                setData(<img key={attachment.path} src={attachment.path} alt={"attachment"}/>);
            if (attachment.path.toLowerCase().endsWith(".mp4"))
                setData(<video controls key={attachment.path} src={attachment.path}/>);
            if (attachment.path.toLowerCase().endsWith("mp3") ||
                attachment.path.toLowerCase().endsWith("m4a") ||
                attachment.path.toLowerCase().endsWith("ogg"))
                setData(<audio controls key={attachment.path} src={attachment.path}/>);
        }
        setLoaded(true);
        return () => {
        }
    }, [attachment, isLoaded])
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