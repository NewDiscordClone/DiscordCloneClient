import React, {useEffect, useRef, useState} from 'react';
import styles from "./Footer.module.scss"
import Select from "../../Select/Select";

export type Lang = {
    title: string;
    icon: string;
    code: string;
}

const languages: Lang[] = [
    {
        title: "English, USA",
        icon: "images/English USA.png",
        code: "us"
    },
    {
        title: "Українська",
        icon: "images/Ukraine.png",
        code: "ua"
    }
]
const LanguageSelect = () => {
    return <Select elements={languages}/>
};

export default LanguageSelect;