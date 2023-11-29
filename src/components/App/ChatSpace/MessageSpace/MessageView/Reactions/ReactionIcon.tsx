import React, {useState} from 'react';
import styles from "./Reactions.module.scss"
import csx from "classnames";

type Props = {
    emoji: string;
    number: number;
    onClick: (emoji: string) => void;
    isSelected?: boolean
}
const ReactionIcon = ({emoji, number, onClick, isSelected}: Props) => {
    return (
        <div className={csx(styles.reaction, {[styles.selected]:isSelected})} onClick={() => onClick(emoji)}>
            {emoji}
            <span>{number}</span>
        </div>
    );
};

export default ReactionIcon;