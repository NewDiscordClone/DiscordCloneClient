import React, {useContext} from 'react';
import styles from "./MessageView.module.scss";
import Message from "../../../../../models/Message";
import MessageViewModel from "./MessageViewModel";
import {useContextMenu} from "../../../ContextMenu/ContextMenuProvider";
import {AppContext} from "../../../../../Contexts";
import {ContextOption} from "../../../ContextMenu/ContextOption";
import MessageContent from "./MessageContent";

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

function isNextDay(currentSendTime: Date, previousSendTime: Date) {
    // Get the date part of the sendTime (without the time)
    const currentDate = new Date(new Date(currentSendTime).toDateString());
    const previousDate = new Date(new Date(previousSendTime).toDateString());

    // Compare if the currentDate is greater than the previousDate
    return currentDate > previousDate;
}

type Props = {
    message: MessageViewModel;
    prev?: Message;
    isEdit: boolean;
    setEdit: (value: boolean) => void;
}
const MessageView = ({message, prev, isEdit, setEdit}: Props) => {
    const {getData, user} = useContext(AppContext);

    function removeMessage() {
        getData.messages.removeMessage(message.id as string, message.chatId).catch();
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
    const id = message.id as string;
    useContextMenu({
        id,
        options
    })


    const isMoreThanDay: boolean = prev ? isNextDay(message.sendTime, prev.sendTime) : true
    const isCompact: boolean = !isMoreThanDay &&
        // TODO: check if this message is a response
        prev !== undefined && //previous is present
        prev.author?.id === message.message.author?.id && //it's the same user
        Number(new Date(message.sendTime)) - Number(new Date(prev?.sendTime as Date)) < 1000 * 60 * 10; //and the message was sent in 10 minutes after previous
    return (
        <>
            {isMoreThanDay &&
				<div className={styles.divider}>
					<span>{new Date(message.sendTime).toDateString()}</span>
				</div>
            }
            <div className={styles.messageContainer} /*onClick={onClick}*/ id={id}>
                {isCompact ?
                    <div className={styles.compactMessage}>
                        <span
                            className={styles.time}>{new Date(message.sendTime).toLocaleTimeString().slice(0, 5)}</span>
                        <div className={styles.content}>
                            <MessageContent isEdit={isEdit} setEdit={setEdit} message={message}/>
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
                            <MessageContent isEdit={isEdit} setEdit={setEdit} message={message}/>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default MessageView;