import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../../../../Contexts";
import {GifObject} from "../../../../../../api/TenorController";
import tabStyles from "./GIFs.module.scss";
import GIFScroll from "./GIFScroll";
import useGIFs from "./useGifs";

type Props = {
    search: string
    sendGif: (gif: GifObject) => void;
}
const SearchGiFs = ({search, sendGif}: Props) => {
    const {getData} = useContext(AppContext);
    const {load, next, children} = useGIFs(() => getData.tenor.search(search), sendGif, [search]);

    function onScrolled() {
        load(() => getData.tenor.search(search, next));
    }

    return (
        <GIFScroll onScrolledToBottom={onScrolled}>
            {children}
        </GIFScroll>
    );
};

export default SearchGiFs;