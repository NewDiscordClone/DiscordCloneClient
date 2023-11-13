import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./App/ChatSpace/MessageInput/MessageInput.module.scss";
import GIFsTab from "./App/ChatSpace/MessageInput/AttachmentsPanel/GIFs/GIFsTab";
import {AppContext} from "../Contexts";
import {GetServerData} from "../api/GetServerData";
import EmbedAttachment from "./App/ChatSpace/MessageSpace/MessageView/EmbedAttachment";
import AttachmentView from "./App/ChatSpace/MessageSpace/MessageView/AttachmentView";
import {MetaData} from "../models/MetaData";


const baseUrl: string = process.env.BASE_URL ?? "https://localhost:7060"
const EmojiInputTest = () => {
    const [text, setText] = useState<string>("");
    const [metaData, setMetaData] = useState<MetaData>();

    useEffect(() => {
        new GetServerData(baseUrl).proxy.getMetadata("https://docs.unity3d.com/ru/current/Manual/index.html")
            .then(metaData => metaData && setMetaData(metaData));

    }, [])
    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            setText(event.currentTarget.innerText);
        }
    };

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
            {metaData &&
				<EmbedAttachment metadata={{...metaData, image: undefined}}/>
            }
        </>
    );
};

export default EmojiInputTest;