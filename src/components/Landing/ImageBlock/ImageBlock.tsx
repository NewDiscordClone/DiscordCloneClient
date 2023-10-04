import React from 'react';
import styles from "./ImageBlock.module.scss"
const ImageBlock = ({src} : {src: string}) => {
    return (
        <div className={styles.block}>
            <img src={src} alt={"image"}/>
        </div>
    );
};

export default ImageBlock;