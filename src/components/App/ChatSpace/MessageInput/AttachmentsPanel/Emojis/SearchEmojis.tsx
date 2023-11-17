import React from 'react';
import styles from "./Emojis.module.scss"
import EmojiItem from "./EmojiItem";
import emojiTermsJson from "./emoji-terms.json";
import TermsDictionary from "./TermsDictionary";

type Props = {
    searchTerm: string
    onHover?: (char: string) => void;
    onClick?: React.MouseEventHandler
}

const terms = emojiTermsJson as unknown as TermsDictionary

const EmojisGroup = ({searchTerm, onHover, onClick}: Props) => {
    const emojis = Object.keys(terms)
        .filter(e => terms[e]
            .find(term => term.toLowerCase()
                .includes(searchTerm.toLowerCase())))
    return (
        <div className={styles.group}>
            <div className={styles.emojis}>
                {emojis.map(e => <EmojiItem key={e} e={e} onHover={onHover} onClick={onClick}/>)}
            </div>
        </div>
    );
};

export default EmojisGroup;