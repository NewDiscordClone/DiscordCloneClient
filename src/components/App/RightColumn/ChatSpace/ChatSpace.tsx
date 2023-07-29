import React from 'react';
import styles from './ChatSpace.module.scss'
import csx from "classnames"
import MessageSpace from "./MessageSpace";

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
                Content for the third row
            </div>
        </div>
    );
};

export default ChatSpace;