import React from 'react';
import styles from "./Emojis.module.scss"
import emojiJson from "./emoji-terms.json"
import TermsDictionary from "./TermsDictionary";

type Props = {
    e: string;
    onHover?: (char: string) => void;
    onClick?: React.MouseEventHandler
}

const emojiTerms = emojiJson as TermsDictionary;
const EmojiItem = ({e, onHover, onClick}: Props) => {

    return (
        <div className={styles.emojiItem}
             onMouseOver={() => onHover && onHover(e)}
             onClick={onClick}>
            {e}
        </div>
    );
};

export default EmojiItem;