import React, {useContext, useRef, useState} from 'react';
import styles from "../AttachmentsPanel.module.scss";
import appStyles from "../../../../App.module.scss";
import FeaturedGIFs from "./FeaturedGIFs";
import SearchGIFs from "./SearchGIFs";
import GIFsCategories from "./GIFsCategories";
import {GifObject} from "../../../../../../api/TenorController";
import {AppContext, SelectedChatContext} from "../../../../../../Contexts";

type Props = {
    close: () => void;
}
const GiFsTab = ({close}: Props) => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const [search, setSearch] = useState<string>("");
    const [isFeatured, setFeatured] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>();

    function handleOnChange(value: string) {
        setSearch(value);
    }

    function handleSetSearch(value: string) {
        handleOnChange(value);
        searchRef.current?.focus();
    }

    function sendGif(gif: GifObject) {
        if(!selectedChatId) throw new Error("SelectedChatId can't be null at this point");
        getData.messages.addMessage(selectedChatId, {text: "",
            attachments: [{path: gif.media_formats.gif.url, isSpoiler: false, isInText: false}]})
        close();
    }

    return (
        <div>
            <div className={styles.inputContainer}>
                {(search || isFeatured) &&
					<img className={styles.arrow} src={"icons/back.svg"} alt={"back"}
						 onClick={() => {setFeatured(false); setSearch("");}}/>
                }
                {isFeatured ?
                    <h2>Featured GIFs</h2>
                    :
                    <input
                        className={appStyles.customInput}
                        type={"text"}
                        placeholder={"Search Tenor"}
                        value={search}
                        ref={searchRef as any}
                        onChange={e => handleOnChange(e.target.value)}
                    />
                }
            </div>

            {(isFeatured && <FeaturedGIFs sendGif={sendGif}/>) ||
                (search && <SearchGIFs search={search} sendGif={sendGif}/>) ||
				<GIFsCategories
                    search={search}
                    setSearch={handleSetSearch}
                    openFeatured={() => setFeatured(true)}/>
            }

        </div>
    );
};

export default GiFsTab;