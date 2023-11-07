import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"

type Props = {
    title?: string;
    children: ReactNode;
}
const InputSection = ({children, title}: Props) => {
    return (
        <div className={styles.inputSection}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
};

export default InputSection;