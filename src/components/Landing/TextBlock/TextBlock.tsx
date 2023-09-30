import React from 'react';
import styles from "./TextBlock.module.scss"

type Props = {
    header: string;
    text: string;
}
const TextBlock = ({header, text} : Props) => {
    return (
        <div className={styles.block}>
            <h2>{header}</h2>
            <p>{text}</p>
        </div>
    );
};

export default TextBlock;