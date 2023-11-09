import React, {useRef, useState} from 'react';
import styles from "./AttachmentsPanel.module.scss"
import csx from "classnames";
import GIFsTab from "./GIFs/GIFsTab";

export enum Tab {
    Gifs,
    Stickers,
    Emojis,
}

type Props = {
    initialTab: Tab
    close: () => void;
}
const AttachmentsPanel = ({initialTab, close}: Props) => {
    const [tab, setTab] = useState<Tab>(initialTab);

    const placeholder: string =
        ((tab === Tab.Gifs && "Search Tenor") ||
            (tab === Tab.Stickers && "Search sticker") ||
            (tab === Tab.Emojis && "Find the perfect emoji")) || "";



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
                    (tab === Tab.Stickers && <></>) ||
                    (tab === Tab.Emojis && <></>)
                }
            </div>
        </div>
    );
};

export default AttachmentsPanel;