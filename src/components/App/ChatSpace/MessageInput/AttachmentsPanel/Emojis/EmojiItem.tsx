import React from 'react';
import styles from "./Emojis.module.scss"
import emojiJson from "./emoji-terms.json"
import TermsDictionary from "./TermsDictionary";

type Props = {
    e: string;
    onHover?: (char: string) => void;
    onClick?: (chat: string) => void;
}

const emojiTerms = emojiJson as TermsDictionary;
const EmojiItem = ({e, onHover, onClick}: Props) => {

    return (
        <div className={styles.emojiItem}
             onMouseOver={() => onHover && onHover(e)}
             onClick={() => console.log({emoji: e, ...emojiTerms[e]}) /*onClick && onClick(e)*/}>
            {e}
        </div>
    );
};

export default EmojiItem;