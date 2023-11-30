import React from 'react';
import styles from "./Header.module.scss"
import csx from "classnames";
import useMinWidthChecker from "../../useMinWidthChecker";
import DownloadButton from "./DownloadButton";

type Props = {
    open: () => void,
    isAuthorized: boolean
}
const Header = ({open, isAuthorized}: Props) => {
    const isPageNarrow = useMinWidthChecker(720);
    return (
        <div className={csx(styles.background)}>
            {!isPageNarrow &&
				<div className={styles.buttonContainer}>
					<div className={styles.button} onClick={open}>
                        {isAuthorized ? "Open Sparkle" : "Login"}
					</div>
				</div>
            }
            <div className={csx(styles.header, {[styles.narrow]: isPageNarrow})}>
                <h1>Imagine place...</h1>
                <p>...where you can belong to a school club, a gaming group, or a worldwide art community.
                    Where just you and a handful of friends can spend time together. A place that makes it
                    easy to talk every day and hang out more often.</p>
                {!isPageNarrow &&
					<div className={styles.buttonContainer}>
						<DownloadButton/>
						<div className={csx(styles.button, styles.rightColumn, styles.black)} onClick={open}>
							Open Sparkle in your browser
						</div>
					</div>
                }
            </div>
        </div>
    );
};

export default Header;