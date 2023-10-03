import React from 'react';
import styles from "./Header.module.scss"
import csx from "classnames";

const Header = ({open, isAuthorized}: { open: () => void, isAuthorized: boolean }) => {
    return (
        <div className={styles.background}>
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={open}>
                    {isAuthorized ?"Open Sparkle":"Login"}
                </div>
            </div>
            <div className={styles.header}>
                <h1>Imagine place...</h1>
                <p>...where you can belong to a school club, a gaming group, or a worldwide art community.
                    Where just you and a handful of friends can spend time together. A place that makes it
                    easy to talk every day and hang out more often.</p>
                <div className={styles.buttonContainer}>
                    <div className={csx(styles.button, styles.leftColumn, styles.white)} onClick={open}>
                        Download for Windows
                    </div>
                    <div className={csx(styles.button, styles.rightColumn, styles.black)} onClick={open}>
                        Open Sparkle in your browser
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;