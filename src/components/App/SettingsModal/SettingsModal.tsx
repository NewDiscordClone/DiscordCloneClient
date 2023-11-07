import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"

type Props = {
    children: ReactNode;
}
const SettingsModal = ({children} : Props) => {
    return (
        <div className={styles.modalWindow}>
            {children}
        </div>
    );
};

export default SettingsModal;