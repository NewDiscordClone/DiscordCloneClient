import React, {ReactNode} from 'react';
import styles from "./Section.module.scss"
const Section = ({children} : {children: ReactNode}) => {
    return (
        <div className={styles.section}>
            {children}
        </div>
    );
};

export default Section;