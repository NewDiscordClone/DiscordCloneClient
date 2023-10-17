import React, {useContext, useId} from 'react';
import appStyles from "../../../App.module.scss";
import styles from "./MessageView.module.scss";
import Message from "../../../../../models/Message";
import MessageViewModel from "./MessageViewModel";
import AttachmentView from "./AttachmentView";
import contextMenuProvider, {useContextMenu} from "../../../ContextMenu/ContextMenuProvider";
import {AppContext} from "../../../../../Contexts";
import MessageInput from "../../MessageInput/MessageInput";
import {ContextOption} from "../../../ContextMenu/ContextOption";

const relativeTime = (prevDate: Date): string => {
    const date = new Date(prevDate);
    const today = new Date();
    today.setHours(0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    switch (true) {
        case Number(date) > Number(today):
            return "Today at " + date.toLocaleTimeString().slice(0, 5)
        case Number(date) > Number(yesterday):
            return "Yesterday at " + date.toLocaleTimeString().slice(0, 5)
        default:
            return date.toLocaleDateString() + " " + date.toLocaleTimeString().slice(0, 5);
    }
};

type Props = {
    message: MessageViewModel;
    prev?: Message;
    isEdit: boolean;
    setEdit: (value: boolean) => void;
}
const MessageView = ({message, prev, isEdit, setEdit}: Props) => {
    // const onClick = (event: any) => {
    //     console.log(event.target);
    //     // console.log(prev);
    //     // messageClicked.invoke(message.message);
    // }
    const {getData, user} = useContext(AppContext);

    function removeMessage() {
        getData.messages.removeMessage(message.id as string, message.chatId);
    }

    function pinMessage() {
        getData.messages.pinMessage(message.id as string, message.chatId)
    }

    function unpinMessage() {
        getData.messages.unpinMessage(message.id as string, message.chatId)
    }

    const options: (ContextOption | null)[] = [
        message.message.isPinned ?
            {
                title: "Unpin Message",
                action: unpinMessage
            } :
            {
                title: "Pin Message",
                action: pinMessage
            },
    ];
    if (message.userId === user.id)
        options.push(
            null,
            {
                title: "Edit Message",
                action: () => setEdit(true)
            },
            {
                title: "Remove Message",
                action: removeMessage,
                danger: true
            }
        );
    const id = useId()
    useContextMenu({
        id,
        options
    })


    const isCompact: boolean = //message.message.id as number % 3 < 2;
        // TODO: check if this message is a response
        prev !== undefined && //previous is present
        prev.author?.id === message.message.author?.id && //it's the same user
        Number(new Date(message.sendTime)) - Number(new Date(prev?.sendTime as Date)) < 1000 * 60 * 10; //and the message was sent in 10 minutes after previous

    return (
        <div className={styles.messageContainer} /*onClick={onClick}*/ id={id}>
            {isCompact ?
                <div className={styles.compactMessage}>
                    <span className={styles.time}>{new Date(message.sendTime).toLocaleTimeString().slice(0, 5)}</span>
                    <div className={styles.content}>
                        {isEdit ?
                            <MessageInput editMessage={message.message} finishEditing={() => setEdit(false)}/> :
                            message.text?.split("\n").map((t, i) => <p key={i}>{t}</p>)}
                        {message.attachments.map((a, i) => <AttachmentView key={i} attachment={a}/>)}
                    </div>
                </div>
                :
                <div className={styles.message}>
                    <div className={styles.avatar}>
                        <img src={message.image} alt={"avatar"}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <strong>{message.username}</strong>
                            <span>{relativeTime(message.sendTime)}</span>
                        </div>
                        {isEdit ?
                            <MessageInput editMessage={message.message} finishEditing={() => setEdit(false)}/> :
                            message.text?.split("\n").map((t, i) => <p key={i}>{t}</p>)
                        }
                        {message.attachments.map((a, i) => <AttachmentView key={i} attachment={a}/>)}

                    </div>
                </div>
            }
        </div>
    );
};

export default MessageView;