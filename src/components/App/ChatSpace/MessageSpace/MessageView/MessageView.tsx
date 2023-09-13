import React from 'react';
import styles from "./MessageView.module.scss";
import Message from "../../../../../models/Message";
import MessageViewModel from "./MessageViewModel";

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

const MessageView = ({message, prev}: { message: MessageViewModel, prev?: Message }) => {

    const onClick = () => {
        console.log(message.message);
        console.log(prev);
    }

    const isCompact: boolean = //message.message.id as number % 3 < 2;
        // TODO: check if this message is a response
        prev !== undefined && //previous is present
        prev.user?.id === message.message.user?.id && //it's the same user
        Number(new Date(message.sendTime)) - Number(new Date(prev?.sendTime as Date)) < 1000*60*10; //and the message was sent in 10 minutes after previous

    return (
        <div onClick={onClick}>
            {isCompact ?
                <div className={styles.compactMessage}>
                    <div className={styles.text}>
                        {message.text}
                    </div>
                </div>
                :
                <div className={styles.message}>
                    <div className={styles.avatar}>
                        <img src={message.image} alt={"avatar"}/>
                    </div>
                    <div className={styles.text}>
                        <div className={styles.header}>
                            <strong>{message.username}</strong>
                            <span>{relativeTime(message.sendTime)}</span>
                        </div>
                        {message.text}
                    </div>
                </div>
            }
        </div>

    );
};

export default MessageView;