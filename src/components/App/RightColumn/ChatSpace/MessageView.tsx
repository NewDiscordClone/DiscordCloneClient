import React from 'react';
import styles from "./ChatSpace.module.scss";

const MessageView = ({s} : {s:string}) => {
    return (
        <div className={styles.message}>
            {s}
        </div>
    );
};

export default MessageView;