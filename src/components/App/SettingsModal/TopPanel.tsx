import React from 'react';
import styles from "./SettingsModal.module.scss"

type Props = {
    title?: string;
    icon?: string;
}
const TopPanel = ({title, icon}: Props) => {
    return (
        <div className={styles.topPanel}>
            <h2>{title}</h2>
            {icon &&
				<div className={styles.iconContainer}>
					<img src={icon} alt={"avatar"}/>
				</div>
            }
        </div>
    );
};

export default TopPanel;