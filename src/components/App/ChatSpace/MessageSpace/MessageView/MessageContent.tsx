import React from 'react';
import MessageViewModel from "./MessageViewModel";
import MessageInput from "../../MessageInput/MessageInput";
import parseText from "./parseText";
import AttachmentView from "./AttachmentView";

type Props = {
    isEdit: boolean,
    setEdit: (value:boolean) => void;
    message: MessageViewModel;
}
const MessageContent = ({message, isEdit, setEdit} : Props) => {
    return (
        <>
            {isEdit ?
                <MessageInput editMessage={message.message} finishEditing={() => setEdit(false)}/> :
                message.text && parseText(message.text)
            }
            {message.attachments.map((a, i) => <AttachmentView key={i} attachment={a}/>)}
        </>
    );
};

export default MessageContent;