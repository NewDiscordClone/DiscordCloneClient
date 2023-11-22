import React from 'react';
import MessageViewModel from "./MessageViewModel";
import MessageInput from "../../MessageInput/MessageInput";
import parseText from "./parseText";
import AttachmentView from "./AttachmentView";
import Twemoji from "react-twemoji";
import appStyles from "../../../App.module.scss"

type Props = {
    isEdit: boolean,
    setEdit: (value: boolean) => void;
    message: MessageViewModel;
}
const MessageContent = ({message, isEdit, setEdit}: Props) => {
    return (
        <>
            <Twemoji options={{className: appStyles.emoji}}>
                {isEdit ?
                    <MessageInput editMessage={message.message} finishEditing={() => setEdit(false)}/> :
                    message.text && parseText(message.text)
                }
            </Twemoji>
            {message.attachments.map((a, i) => <AttachmentView key={i} attachment={a} message={message}/>)}
        </>
    );
};

export default MessageContent;