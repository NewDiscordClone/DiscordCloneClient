import React from 'react';
import styles from "./ReadyToStart.module.scss"

const ReadyToStart = () => {
    return (
        <div className={styles.block}>
            <h2>Ready to start your journey?</h2>
            <div className={styles.button}>Open Sparkle in your browser</div>
        </div>
    );
};

export default ReadyToStart;