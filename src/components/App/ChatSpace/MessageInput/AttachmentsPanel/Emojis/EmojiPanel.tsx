import React, {useEffect} from 'react';
import emojiTermsJson from "./emoji-terms.json";
import TermsDictionary from "./TermsDictionary";
import styles from "./Emojis.module.scss"
import Twemoji from "react-twemoji";

const terms = emojiTermsJson as unknown as TermsDictionary

type Props = {
    e: string;
}
const EmojiPanel = ({e}: Props) => {

    return (
        <div className={styles.emojiPanel}>
            <Twemoji>
                <div className={styles.emojiItem}>
                    {e}
                </div>
            </Twemoji>
            <p>{terms[e].join(", ")}</p>
        </div>
    );
};

export default EmojiPanel;