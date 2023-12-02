import React, {useRef, useState} from 'react';
import styles from "./AttachmentsPanel.module.scss"
import csx from "classnames";
import GIFsTab from "./GIFs/GIFsTab";
import EmojisTab from "./Emojis/EmojisTab";
import StickersTab from "./Stickers/StickersTab";

export enum Tab {
    Gifs,
    Stickers,
    Emojis,
}

type Props = {
    tab: Tab
    setTab: (tab: Tab | undefined) => void;
    pasteEmoji?: (char: string) => void;
}
const AttachmentsPanel = ({tab, setTab, pasteEmoji}: Props) => {
    function close() {
        setTab(undefined);
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <div className={styles.tabs}>
                    <div className={csx({[styles.selected]: tab === Tab.Gifs})}
                         onClick={() => setTab(Tab.Gifs)}>
                        GIFs
                    </div>
                    <div className={csx({[styles.selected]: tab === Tab.Stickers})}
                         onClick={() => setTab(Tab.Stickers)}>
                        Stickers
                    </div>
                    <div className={csx({[styles.selected]: tab === Tab.Emojis})}
                         onClick={() => setTab(Tab.Emojis)}>
                        Emojis
                    </div>
                </div>

                {
                    (tab === Tab.Gifs &&
						<GIFsTab close={close}/>) ||
                    (tab === Tab.Stickers && <StickersTab close={close}/>) ||
                    (tab === Tab.Emojis &&
                        <EmojisTab close={close} pasteEmoji={pasteEmoji}/>
                    )
                }
            </div>
        </div>
    );
};

export default AttachmentsPanel;