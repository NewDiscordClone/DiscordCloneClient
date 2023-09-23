import React, {useContext, useEffect, useState} from 'react';
import styles from '../App.module.scss'
import {AppContext, FilesDroppedContext, SelectedChatContext} from "../../../Contexts";
import Attachment from "../../../models/Attachment";
import {text} from "stream/consumers";

const MessageInput = () => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const event = useContext(FilesDroppedContext);
    const [message, setMessage] = useState<string>("");
    const [height, setHeight] = useState<string>();
    const [files, setFiles] = useState<File[]>([]);
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            const addMessage = (attachments: Attachment[]) => {
                if(!message && attachments.length === 0) return;
                getData.messages.addMessage(selectedChatId as string, {
                    text: message,
                    attachments
                })
                setMessage("");
                setFiles([]);
            }
            if(files.length <= 0) addMessage([]);
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
    const handleChange = (area:any) =>{
        setMessage(area.target.value);
        setHeight(area.scrollHeight+"px")
    }

    useEffect(() => {
        function onFilesDropped(files: FileList){
            console.log(files);
            setFiles(prev => {
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    if(file)
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

    if(!selectedChatId) return null;

    return (
        <input
            type={"text"}
            className={styles.customInput}
            placeholder="Type here..."
            value={message}
            style={({height: height})}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
        />
    );
};

export default MessageInput;