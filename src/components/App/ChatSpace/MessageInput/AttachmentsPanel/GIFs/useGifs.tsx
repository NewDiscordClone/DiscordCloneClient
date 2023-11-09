import React, {DependencyList, useEffect, useState} from 'react';
import {GifObject, Response} from "../../../../../../api/TenorController";
import tabStyles from "./GIFs.module.scss";

let isLoading = false;
const useGifs = (firstLoad: () => Promise<Response>, sendGif: (gif: GifObject) => void, deps: DependencyList = []) => {
    const [gifObjects, setGifObjects] = useState<GifObject[]>([])
    const [next, setNext] = useState<string>();

    useEffect(() => {
        firstLoad()
            .then(response => {
                setGifObjects(response.results);
                setNext(response.next);
            })
    }, deps)

    function load(loadFunc: () => Promise<Response>) {
        if(isLoading) return;
        isLoading = true;
        loadFunc()
            .then(response => {
                setGifObjects(prev => [...prev, ...response.results]);
                setNext(response.next);
            })
            .finally(() => isLoading = false);
    }

    return {
        load, next, children: (
            gifObjects &&
            gifObjects.map(gif => <img key={gif.id} src={gif.media_formats.tinygif.url}
                                       className={tabStyles.gif} alt={"gif"} onClick={() => sendGif(gif)}/>)
        )
    }
};

export default useGifs;