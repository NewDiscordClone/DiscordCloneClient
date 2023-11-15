import React from 'react';
import styles from "./Emojis.module.scss"
import csx from "classnames";

type Props = {
    group: string
    isSelected: boolean;
}
const GroupIcon = ({group, isSelected}: Props) => {

    function handleClick() {
        document.getElementById(group)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    return (
        <div className={csx(styles.group, {[styles.selected]: isSelected})} onClick={handleClick}>
            <img src={"icons/emoji.svg"} alt={group}/>
        </div>
    );
};

export default GroupIcon;