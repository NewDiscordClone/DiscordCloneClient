import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"

type Props = {
    children: ReactNode
}
const BlockSection = ({children} : Props) => {
    return (
        <div className={styles.blockSection}>
            {children}
        </div>
    );
};

export default BlockSection;