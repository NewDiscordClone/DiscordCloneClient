import React, {useState} from 'react';
import {Tab} from "./AttachmentsPanel/AttachmentsPanel";
import styles from "./MessageInput.module.scss"

type Props = {
    setAttachmentsPanelTab: (tab: Tab) => void;
}
const AttachmentsButtons = ({setAttachmentsPanelTab} : Props) => {
    const [hover, setHover] = useState<Tab>()

    return (
        <>
            <img src={`icons/gifs${hover === Tab.Gifs? '-hover': ''}.svg`} alt={"gifs"}
                 onMouseOver={() => setHover(Tab.Gifs)}
                 onMouseLeave={() => setHover(undefined)}
                 onClick={() => setAttachmentsPanelTab(Tab.Gifs)}/>
            <img src={`icons/stickers${hover === Tab.Stickers? '-hover': ''}.svg`} alt={"stickers"}
                 onMouseOver={() => setHover(Tab.Stickers)}
                 onMouseLeave={() => setHover(undefined)}
                 onClick={() => setAttachmentsPanelTab(Tab.Stickers)}/>
            <img src={`icons/emojis${hover === Tab.Emojis? '-hover': ''}.svg`} alt={"emojis"}
                 onMouseOver={() => setHover(Tab.Emojis)}
                 onMouseLeave={() => setHover(undefined)}
                 onClick={() => setAttachmentsPanelTab(Tab.Emojis)}/>
        </>
    );
};

export default AttachmentsButtons;