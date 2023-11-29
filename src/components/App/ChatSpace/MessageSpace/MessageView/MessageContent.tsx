import React, {useContext} from 'react';
import MessageViewModel from "./MessageViewModel";
import MessageInput from "../../MessageInput/MessageInput";
import parseText from "./parseText";
import AttachmentView from "./Attachments/AttachmentView";
import Twemoji from "react-twemoji";
import appStyles from "../../../App.module.scss"
import ReactionsRow from "./Reactions/ReactionsRow";
import {AppContext} from "../../../../../Contexts";

type Props = {
    isEdit: boolean,
    setEdit: (value: boolean) => void;
    message: MessageViewModel;
}
const MessageContent = ({message, isEdit, setEdit}: Props) => {
    const {getData} = useContext(AppContext);
    function addReaction(emoji: string) {
        getData.messages.addReaction(message.id as string, emoji, message.chatId);
    }
    function removeReaction(emoji: string) {
        getData.messages.removeReaction(message.id as string, emoji, message.chatId);
    }
    return (
        <>
            <Twemoji options={{className: appStyles.emoji}}>
                {isEdit ?
                    <MessageInput editMessage={message.message} finishEditing={() => setEdit(false)}/> :
                    message.text && parseText(message.text)
                }
            </Twemoji>
            {message.attachments.map((a, i) => <AttachmentView key={i} attachment={a} message={message}/>)}
            <ReactionsRow
                chatId={message.chatId}
                reactions={message.reactions}
                addReaction={addReaction}
                removeReaction={removeReaction}/>
        </>
    );
};

export default MessageContent;