import React, {ReactNode} from 'react';
import styles from "./SettingsModal.module.scss"
import csx from "classnames";

type Props = {
    title?: string;
    children: ReactNode;
    className?: string;
}
const InputSection = ({children, title, className}: Props) => {
    return (
        <div className={csx(styles.inputSection, className)}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
};

export default InputSection;