import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./App/ChatSpace/MessageInput/MessageInput.module.scss";
import {GetServerData} from "../api/GetServerData";
import EmbedAttachment from "./App/ChatSpace/MessageSpace/MessageView/EmbedAttachment";
import {MetaData} from "../models/MetaData";
import Twemoji from "react-twemoji";
import appStyles from "./App/App.module.scss"

const baseUrl: string = process.env.BASE_URL ?? "https://localhost:7060"
const EmojiInputTest = () => {
    const [text, setText] = useState<string>("");
    const [metaData, setMetaData] = useState<MetaData>();

    useEffect(() => {
        new GetServerData(baseUrl).proxy.getMetadata("https://docs.unity3d.com/ru/current/Manual/index.html")
            .then(metaData => metaData && setMetaData(metaData));

    }, [])
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            setText(event.currentTarget.innerText);
        }
    };

    function handleInput(e: React.FormEvent<HTMLDivElement>) {
        let result = '';
        e.currentTarget.childNodes.forEach(node => {
            if (node.nodeType === 3) {
                // Text node
                result += (node as Text).nodeValue ?? '';
            } else if (node.nodeType === 1 && (node as Element).tagName.toLowerCase() === 'img') {
                // Image node
                const altText = (node as HTMLImageElement).getAttribute('alt');
                result += altText;
            }
        })
        setText(result as string)
    }

    return (
        <>
            <Twemoji options={{className: appStyles.emoji}}>
                <div
                    className={csx(styles.textArea)}
                    contentEditable={true}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Type here...">
                    f
                </div>
            </Twemoji>
            <div>{text}</div>
            {metaData &&
				<EmbedAttachment metadata={{...metaData, image: undefined}}/>
            }
        </>
    );
};

export default EmojiInputTest;