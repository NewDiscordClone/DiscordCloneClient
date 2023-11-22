import React from 'react';
import styles from "./SettingsModal.module.scss"
import csx from "classnames";

type Props = {
    title: string;
    onClick: () => void
    danger?: boolean;
}
const Button = ({title, onClick, danger = false}:Props) => {
    return (
        <div className={csx(styles.button, {[styles.danger]: danger})} onClick={onClick}>
            {title}
        </div>
    );
};

export default Button;