import React, {useEffect, useRef, useState} from 'react';
import csx from "classnames";
import styles from "./App/ChatSpace/MessageInput/MessageInput.module.scss";
import {GetServerData} from "../api/GetServerData";
import EmbedAttachment from "./App/ChatSpace/MessageSpace/MessageView/EmbedAttachment";
import {MetaData} from "../models/MetaData";
import Twemoji from "react-twemoji";
import appStyles from './App/App.module.scss'


const baseUrl: string = process.env.BASE_URL ?? "https://localhost:7060"
const EmojiInputTest = () => {
    const [text, setText] = useState<string>("");
    const [metaData, setMetaData] = useState<MetaData>();
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        new GetServerData(baseUrl).proxy.getMetadata("https://docs.unity3d.com/ru/current/Manual/index.html")
            .then(metaData => metaData && setMetaData(metaData));

    }, [])
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            setText(prev => {
                const start = prev.slice(0, 10);
                const end = prev.slice(10);
                return start + "🙄 " + end;
            })
            // event.preventDefault()
            // const selection = window.getSelection();
            // if(!selection) return;
            // const range = selection.getRangeAt(0);
            // if(!range) return;
            // if(!selection.focusNode) return;
            // range.setStart(range.endContainer, range.endOffset-1);
            // range.collapse(true);
        }
    };

    function handleInput(e: React.FormEvent<HTMLDivElement>) {
        // console.log("before: "+ref.current?.innerHTML)
        setText(ref.current?.innerHTML ?? "");
    }

    // console.log("render: "+ref.current?.innerHTML)
    console.log("render")
    useEffect(() => {
        console.log("useEffect")
        // console.log("after: "+ref.current?.innerHTML)
        // const selection = window.getSelection();
        // if(!selection ) return;
        // const range = selection.getRangeAt(0);
        // if(!range) return;
        // if(!selection.focusNode) return;
        // range.setStart(range.endContainer, range.endOffset);
        // range.collapse(false);
    }, [text])

    function handleOnSelect() {
        // const selection = window.getSelection();
        // if(!selection || selection.rangeCount === 0) return;
        // const range = selection.getRangeAt(0);
        // if(!range) return;
        // if(!selection.focusNode) return;
        // console.log(selection.focusNode)
        // console.log(selection.focusOffset)
        console.log(ref.current?.innerHTML);
    }

    return (
        <>
            <Twemoji options={{className: appStyles.emoji}}>
                <div
                    className={csx(styles.textArea)}
                    contentEditable={true}
                    ref={ref as any}
                    // onKeyDown={handleKeyDown}
                    onBeforeInput={e => {
                        console.log("BeforeInput")
                        handleInput(e)
                    }}
                    onInput={e => console.log("Input")}
                    onChange={e => console.log("Change")}
                    onSelect={e => {console.log("Select"); handleOnSelect();}}
                    onKeyDown={handleKeyDown}
                    // placeholder="Type here..."
                >
                </div>
            </Twemoji>
            <div>{text}</div>
            <input type={"text"} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}/>
            {metaData &&
                <EmbedAttachment metadata={{ ...metaData, image: undefined }} />
            }
        </>
    );
};

export default EmojiInputTest;