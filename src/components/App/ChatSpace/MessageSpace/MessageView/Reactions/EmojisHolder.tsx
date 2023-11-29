import React, {useEffect, useRef, useState} from 'react';
import EmojisTab from "../../../MessageInput/AttachmentsPanel/Emojis/EmojisTab";
import styles from "./Reactions.module.scss"

type Props = {
    close: () => void;
    onPasteEmoji: (char: string) => void;
}
const EmojisHolder = ({close, onPasteEmoji}: Props) => {
    const ref = useRef<HTMLDivElement>();
    const [isShown, setShown] = useState<boolean>(false);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        }

        if (isShown) {
            window.addEventListener("click", handleClick);
            return () => window.removeEventListener("click", handleClick);
        }
        else setShown(true);
    }, [isShown, close])

    return (
        <div className={styles.emojisContainer} ref={ref as any}>
            <div className={styles.emojisPanel}>
                <EmojisTab close={close} pasteEmoji={onPasteEmoji}/>
            </div>
        </div>
    );
};

export default EmojisHolder;