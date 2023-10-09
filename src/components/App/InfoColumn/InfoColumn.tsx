import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./InfoColumn.module.scss";

const widthToHide = 900 //1130

const InfoColumn = () => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)

    useEffect(() => {
        const updatePageWidth = () => {
            setHideInfo(window.innerWidth < widthToHide)
        };
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);

        return () => {
            window.removeEventListener('resize', updatePageWidth);
        };
    });

    return (
        <div className={csx(styles.infoColumn, {[styles.hide]: hideInfo})}>

        </div>
    );
};

export default InfoColumn;