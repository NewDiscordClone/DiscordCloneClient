import React, {useContext} from 'react';
import styles from "./Stickers.module.scss"
import {AppContext, SelectedChatContext} from "../../../../../../Contexts";
type Props = {
    sticker: string;
    close: () => void;
}
const StickerItem = ({sticker, close} : Props) => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    function handleClick () {
        getData.messages.addMessage(selectedChatId as string,
            {text: "", attachments: [{path: sticker, isInText: false, isSpoiler: false}]})
        close();
    }
    return (
        <div className={styles.item} onClick={handleClick}>
            <img src={sticker} alt={sticker}/>
        </div>
    );
};

export default StickerItem;