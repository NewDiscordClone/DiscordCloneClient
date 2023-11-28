import React from 'react';
import styles from "./ImageBlock.module.scss"
import useMinWidthChecker from "../../useMinWidthChecker";
import csx from "classnames";
const ImageBlock = ({src} : {src: string}) => {
    const isPageNarrow = useMinWidthChecker(1100);
    return (
        <div className={csx(styles.block, {[styles.narrow]: isPageNarrow})}>
            <img src={src} alt={"image"} className={csx({[styles.narrow]: isPageNarrow})}/>
        </div>
    );
};

export default ImageBlock;