import React, {useContext, useRef, useState} from 'react';
import styles from './MessageInput.module.scss'
import {AppContext, SelectedChatContext} from "../../../../Contexts";
import Attachment from "../../../../models/Attachment";
import csx from "classnames";
import AttachmentPreview from "./AttachmentPreview";
import {AttachmentToSend} from "./AttachmentToSend";
import FileUpload from "../../FileUpload/FileUpload";
import Message from "../../../../models/Message";
import {AddMessageRequest} from "../../../../api/MessagesController";

type Props = {
    editMessage?: Message | undefined
    finishEditing?: () => void
}
const MessageInput = ({editMessage = undefined, finishEditing}: Props) => {
    const {getData, chats} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const [message, setMessage] = useState<string>(editMessage?.text ?? "");
    const [attachments, setAttachments] = useState<AttachmentToSend[]>([]);
    const [compact, setCompact] = useState<boolean>(true);
    const ref = useRef<HTMLTextAreaElement>()
    const addMessage = (message: AddMessageRequest) => {
        if (!message.text && attachments.length === 0) return;
        getData.messages.addMessage(selectedChatId as string, message);
    }
    function returnToDefault(){
        setMessage("");
        setAttachments([]);
        setCompact(true);
        if (ref.current)
            ref.current.style.height = "27px";
    }
    const sendEdit = () => {
        if(!editMessage) return;
        getData.messages.editMessage(
            editMessage?.id as string,
            editMessage?.chatId as string,
            message)
        editMessage.text = message;
        if(finishEditing)
            finishEditing();
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if(editMessage) {
                sendEdit()
                return;
            }

            const messageText: string = message;
            if (attachments.length <= 0) addMessage({text: messageText, attachments: []});
            else {
                const formData = new FormData();
                for (const attachment of attachments) {
                    formData.append('file', attachment.file);
                }
                getData.media
                    .uploadMedia(formData)
                    .then(media => media
                        .map<Attachment>((path, index) => ({
                                path,
                                isInText: false,
                                isSpoiler: attachments[index].isSpoiler
                            }
                        )))
                    .then(att => addMessage({text: messageText, attachments: att}));
            }
            returnToDefault();
        }
        else if(event.key === "Escape" && editMessage) {
            if(finishEditing)
                finishEditing();
        }
    };
    const handleChange = (area: any) => {
        setMessage(area.target.value);
        if (ref.current) {
            ref.current.style.height = "0px";
            ref.current.style.height = ref.current.scrollHeight + "px";
        }
    }

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

    function instaUpload(files: FileList) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file)
                formData.append('file', file);
        }
        getData.media
            .uploadMedia(formData)
            .then(media => media
                .map<Attachment>((path, index) => ({
                        path,
                        isInText: false,
                        isSpoiler: false
                    }
                )))
            .then(attachments =>
                getData.messages
                    .addMessage(selectedChatId as string, {text: "", attachments}));
    }

    function removeAttachment(index: number) {
        setAttachments(prev => {
            const newState = [...prev];
            newState.splice(index, 1);
            return newState;
        })
    }

    function setSpoiler(index: number, value: boolean) {
        setAttachments(prev => {
            const newState = [...prev];
            newState[index].isSpoiler = value;
            return newState;
        })
    }

    if (!selectedChatId) return null;
    return (
        <>
            {!editMessage &&
				<FileUpload
					chatName={(chats[selectedChatId] as unknown as { title: string }).title}
					onFilesDropped={onFilesDropped}
					instaUpload={instaUpload}
				/>
            }
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
        </>
    );
};

export default MessageInput;