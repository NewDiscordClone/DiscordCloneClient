import React, {useContext, useEffect, useState} from 'react';
import {GifObject} from "../../../../../../api/TenorController";
import {AppContext} from "../../../../../../Contexts";
import GIFScroll from "./GIFScroll";
import tabStyles from "./GIFs.module.scss";
import useGIFs from "./useGifs";

type Props = {
    sendGif: (gif: GifObject) => void;
}
const FeaturedGiFs = ({sendGif} : Props) => {
    const {getData} = useContext(AppContext);
    const {load, next, children} = useGIFs(() => getData.tenor.featured(), sendGif);

    function onScrolled() {
        load(() => getData.tenor.featured(next));
    }

    return (
        <GIFScroll onScrolledToBottom={onScrolled}>
            {children}
        </GIFScroll>
    );
};

export default FeaturedGiFs;