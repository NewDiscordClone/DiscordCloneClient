import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './MessageInput.module.scss'
import {AppContext, FilesDroppedContext, SelectedChatContext} from "../../../../Contexts";
import Attachment from "../../../../models/Attachment";
import csx from "classnames";
import AttachmentPreview from "./AttachmentPreview";
import {AttachmentToSend} from "./AttachmentToSend";
import * as buffer from "buffer";

const MessageInput = () => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const event = useContext(FilesDroppedContext);
    const [message, setMessage] = useState<string>("");
    const [attachments, setAttachments] = useState<AttachmentToSend[]>([]);
    const [compact, setCompact] = useState<boolean>(true);
    const ref = useRef<HTMLTextAreaElement>()
    const handleKeyDown = (event: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const addMessage = (attachments: Attachment[]) => {
                if (!message && attachments.length === 0) return;
                getData.messages.addMessage(selectedChatId as string, {
                    text: message,
                    attachments
                })
                setMessage("");
                setAttachments([]);
                setCompact(true);
                if (ref.current) {
                    ref.current.style.height = "27px";
                }
            }
            if (attachments.length <= 0) addMessage([]);
            else {
                const formData = new FormData();
                for (const attachment of attachments) {
                    formData.append('file', attachment.file);
                }
                getData.media.uploadMedia(formData).then(media => {
                    const att = media.map<Attachment>((path, index) => ({path, isInText: false, isSpoiler: attachments[index].isSpoiler}));
                    addMessage(att);
                })
            }
        }
    };
    const handleChange = (area: any) => {
        setMessage(area.target.value);
        if (ref.current) {
            ref.current.style.height = "0px";
            ref.current.style.height = ref.current.scrollHeight + "px";
        }
    }

    useEffect(() => {
        function onFilesDropped(files: FileList) {
            // console.log(files);
            setAttachments(prev => {
                const newList = [...prev]
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    if (file)
                        newList.push({file, isSpoiler: false});
                }
                return newList;
            });
        }

        event.addListener(onFilesDropped)
        return () => {
            event.removeListener(onFilesDropped);
        }
    }, [event])

    function removeAttachment(index: number) {
        setAttachments(prev => {
            const newState = [...prev];
            newState.splice(index, 1);
            return newState;
        })
    }
    function setSpoiler(index: number, value: boolean){
        setAttachments(prev => {
            const newState = [...prev];
            newState[index].isSpoiler = value;
            return newState;
        })
    }

    if (!selectedChatId) return null;
    return (
        <div className={csx(styles.area, {[styles.hasAttachments]: attachments.length > 0})}>
            {attachments.length <= 0 ? null :
                <div className={styles.attachmentList}>
                    {attachments.map((a, i) =>
                        <AttachmentPreview
                            key={i}
                            attachment={a}
                            removeAttachment={() => removeAttachment(i)}
                            setSpoiler={(value) => setSpoiler(i, value)}/>
                    )}
                </div>
            }
            <textarea
                className={csx(styles.textArea, {[styles.compact]: compact})}
                placeholder="Type here..."
                value={message}
                maxLength={2000}
                ref={ref as any}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default MessageInput;