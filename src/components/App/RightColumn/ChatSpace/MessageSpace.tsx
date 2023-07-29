import React from 'react';
import styles from "./ChatSpace.module.scss"
import MessageView from "./MessageView";

const MessageSpace = () => {
    const arr: string[] = []
    for (let i = 0; i < 200; i++) {
        arr.push(i.toString());
    }
    return (
        <div className={styles.messageContainer}>
            {arr.map(s => <MessageView s={s}/>)}
        </div>
    );
};

export default MessageSpace;