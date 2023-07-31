import React from 'react';
import styles from "./ChatSpace.module.scss";
import Message from "../../../../models/Message";
import ServerProfile from "../../../../models/ServerProfile";
import MessageViewModel from "./MessageViewModel";

const relativeTime = (prevDate: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    switch (true) {
        case Number(prevDate) > Number(today):
            return "Today at " + prevDate.toLocaleTimeString().slice(0, 5)
        case Number(prevDate) > Number(yesterday):
            return "Yesterday at " + prevDate.toLocaleTimeString().slice(0, 5)
        default:
            return prevDate.toLocaleDateString() + " " + prevDate.toLocaleTimeString().slice(0, 5);
    }
};

const MessageView = ({message, prev}: { message: MessageViewModel, prev?: Message }) => {
    //TODO: Зробити так щоб якщо різниця між повідомленнями маленька то
    //TODO: воно було компактним
    const isCompact: boolean = message.message.id as number % 2 == 0;
    return (
        <>
            {isCompact ?
                <div className={styles.compactMessage}>
                    <div className={styles.text}>
                        {message.text}
                    </div>
                </div>
                :
                <div className={styles.message}>
                    <div className={styles.avatar}>
                        <img src={message.image}/>
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
        </>

    );
};

export default MessageView;