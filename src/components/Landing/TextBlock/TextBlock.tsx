import React from 'react';
import styles from "./TextBlock.module.scss"
import useMinWidthChecker from "../../useMinWidthChecker";
import csx from "classnames";

type Props = {
    header: string;
    text: string;
}
const TextBlock = ({header, text} : Props) => {
    const isPageNarrow = useMinWidthChecker(1100);
    return (
        <div className={csx(styles.block, {[styles.narrow]: isPageNarrow})}>
            <h2>{header}</h2>
            <p>{text}</p>
        </div>
    );
};

export default TextBlock;