import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./InfoColumn.module.scss";
import TestButtons from "../../TestButtons";

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
            <TestButtons/>
        </div>
    );
};

export default InfoColumn;