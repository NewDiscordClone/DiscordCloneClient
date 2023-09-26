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
    const ref = useRef<HTMLTextAreaElement>()
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
                if(ref.current) {
                    ref.current.style.height = "27px";
                }
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
        if(ref.current) {
            ref.current.style.height = "0px";
            ref.current.style.height = ref.current.scrollHeight+"px";
        }
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
            <textarea
                className={csx(styles.textArea, {[styles.compact]: compact})}
                placeholder="Type here..."
                value={message}
                ref={ref as any}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

    );
};

export default MessageInput;