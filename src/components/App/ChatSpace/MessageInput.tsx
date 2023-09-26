import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './ChatSpace.module.scss'
import {AppContext, FilesDroppedContext, SelectedChatContext} from "../../../Contexts";
import Attachment from "../../../models/Attachment";
import csx from "classnames";

const MessageInput = () => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const event = useContext(FilesDroppedContext);
    const [message, setMessage] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [compact, setCompact] = useState<boolean>(true);
    const ref = useRef<HTMLDivElement>()
    const handleKeyDown = (event: { key: string; shiftKey: boolean; preventDefault: () => void}) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const addMessage = (attachments: Attachment[]) => {
                if (!message && attachments.length === 0) return;
                getData.messages.addMessage(selectedChatId as string, {
                    text: message,
                    attachments
                })
                setMessage("");
                setFiles([]);
                setCompact(true);
                if (ref.current)
                    ref.current.dataset.replicatedValue = "";
            }
            if (files.length <= 0) addMessage([]);
            else {
                const formData = new FormData();
                for (const file of files) {
                    formData.append('file', file);
                }
                getData.media.uploadMedia(formData).then(media => {
                    const attachments = media.map<Attachment>(path => ({path, isInText: false, isSpoiler: false}));
                    addMessage(attachments);
                })
            }
        }
    };
    const handleChange = (area: any) => {
        setMessage(area.target.value);
        setCompact(area.target.scrollHeight <= 44);
        // console.log(area.target.scrollHeight);
        if (ref.current)
            ref.current.dataset.replicatedValue = area.target.value;
    }

    useEffect(() => {
        function onFilesDropped(files: FileList) {
            console.log(files);
            setFiles(prev => {
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    if (file)
                        prev.push(file);
                }
                return prev
            });
        }

        event.addListener(onFilesDropped)
        return () => {
            event.removeListener(onFilesDropped);
        }
    }, [event])

    if (!selectedChatId) return null;
    return (
        <div className={styles.growWrap} ref={ref as any}>
            <textarea
                className={csx(styles.textArea, {[styles.compact]: compact})}
                placeholder="Type here..."
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>

    );
};

export default MessageInput;