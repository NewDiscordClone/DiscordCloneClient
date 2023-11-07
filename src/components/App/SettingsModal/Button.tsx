import React from 'react';
import styles from "./SettingsModal.module.scss"

type Props = {
    title: string;
    onClick: () => void
}
const Button = ({title, onClick}:Props) => {
    return (
        <div className={styles.button} onClick={onClick}>
            {title}
        </div>
    );
};

export default Button;