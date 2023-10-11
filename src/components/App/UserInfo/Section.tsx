import React, {ReactNode} from 'react';
import styles from "./UserInfo.module.scss"

type Props = {
    header: string
    children: ReactNode;
}
const Section = ({header, children}: Props) => {
    return (
        <div className={styles.section}>
            <h3>{header}</h3>
            {children}
        </div>
    );
};

export default Section;