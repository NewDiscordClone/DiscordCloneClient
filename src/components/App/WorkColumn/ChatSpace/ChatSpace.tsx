import React from 'react';
import styles from './ChatSpace.module.scss'
import csx from "classnames"
import MessageSpace from "./MessageSpace";
import MessageInput from "./MessageInput";

const ChatSpace = () => {
    return (
        <div className={styles.container}>
            <div className={styles.firstRow}>
                Content for the first row
            </div>
            <div className={styles.secondRow}>
                <MessageSpace/>
            </div>
            <div className={styles.thirdRow}>
                <MessageInput/>
            </div>
        </div>
    );
};

export default ChatSpace;