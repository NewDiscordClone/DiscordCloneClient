import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./App/ChatSpace/MessageInput/MessageInput.module.scss";
import GIFsTab from "./App/ChatSpace/MessageInput/AttachmentsPanel/GIFs/GIFsTab";
import {AppContext} from "../Contexts";
import {GetServerData} from "../api/GetServerData";


const baseUrl: string = process.env.BASE_URL ?? "https://localhost:7060"
const EmojiInputTest = () => {
    const [text, setText] = useState<string>("");
    const [getData, setGetData] = useState<GetServerData>();

    useEffect(() => {
        setGetData(new GetServerData(baseUrl))
    }, [])
    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            setText(event.currentTarget.innerText);
        }
    };

    if(!getData) return <></>;
    return (
        <>
            <div
                className={csx(styles.textArea)}
                contentEditable={true}
                onKeyDown={handleInput}
                placeholder="Type here...">
                <p>f</p>
            </div>
            <div>{text}</div>
            <AppContext.Provider value={{getData} as any}>
                <div style={{height:"500px", overflow:"auto"}}>
                    <GIFsTab close={() => {}}/>
                </div>
            </AppContext.Provider>
        </>
    );
};

export default EmojiInputTest;