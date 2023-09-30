import React from 'react';
import styles from "./FullSizeTextBlock.module.scss"

type Props = {
    header: string;
    text: string;
}
const FullSizeTextBlock = ({header, text} : Props) => {
    return (
        <div className={styles.block}>
            <h2>{header}</h2>
            <p>{text}</p>
        </div>
    );
};

export default FullSizeTextBlock;