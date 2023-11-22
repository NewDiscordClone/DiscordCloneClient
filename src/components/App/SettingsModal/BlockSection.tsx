import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"
import csx from "classnames";

type Props = {
    children: ReactNode
    className?: string
}
const BlockSection = ({children, className} : Props) => {
    return (
        <div className={csx(styles.blockSection, className)}>
            {children}
        </div>
    );
};

export default BlockSection;