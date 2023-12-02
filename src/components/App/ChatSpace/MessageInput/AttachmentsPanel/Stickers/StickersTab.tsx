import React, {useContext, useEffect, useState} from 'react';
import styles from "./Stickers.module.scss"
import {AppContext} from "../../../../../../Contexts";
import StickerItem from "./StickerItem";
import csx from "classnames";

type Props = {
    close: () => void;
}
const StickersTab = ({close}: Props) => {
    const {getData} = useContext(AppContext);
    const [stickers, setStickers] = useState<string[]>()
    useEffect(() => {
        if (!stickers) {
            getData.media.getStickers()
                .then(async (arr: string[]) => {
                    // const list: string[] = [];
                    // for (const url in arr) {
                    //     list.push(await getData.media.getMedia(url));
                    // }
                    setStickers(arr)
                });
        }
    }, [getData.media])

    return (
            <div className={csx(styles.content, styles.container)}>
                {stickers?.map(s => <StickerItem key={s} sticker={s} close={close}/>)}
            </div>
    );
};

export default StickersTab;