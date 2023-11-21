import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"
import csx from "classnames";

type Props = {
    children: ReactNode;
    className?: string
}
const SettingsModal = ({children, className} : Props) => {
    return (
        <div className={csx(styles.modalWindow, className)}>
            {children}
        </div>
    );
};

export default SettingsModal;