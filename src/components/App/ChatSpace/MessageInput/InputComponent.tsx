import React, {useEffect, useRef, useState} from 'react';
import csx from "classnames";
import styles from "./MessageInput.module.scss";
import {EventP} from "../../../../Events";

type Props = {
    text: string;
    setText: (text: string) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    emojiPasteEvent: EventP<string>
}

const InputComponent = ({text, setText, onSubmit, onCancel, emojiPasteEvent}: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const [selectionOffset, setSelectionOffset] = useState<number | null>(null);

    useEffect(() => {
        function handlePasteEmoji(char: string) {
            document.execCommand('insertText', false, char+' ');
        }
        emojiPasteEvent.addListener(handlePasteEmoji);
        return () => emojiPasteEvent.removeListener(handlePasteEmoji);
    }, [emojiPasteEvent])

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "17px";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [textAreaRef.current])

    function returnToDefault() {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "27px";
            textAreaRef.current.innerHTML = "";
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // setText(text + "\n");
                return;
            }
            event.preventDefault();
            if (onSubmit) {
                onSubmit();
                returnToDefault();
            }
        }
        if (event.key === "Escape" && onCancel) {
            event.preventDefault();
            onCancel();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "17px";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }

    function handleSelect(e: React.SyntheticEvent<HTMLTextAreaElement>){
        const selection = window.getSelection();
        if(!selection || selection.focusNode !== textAreaRef.current) return;
        setSelectionOffset(selection.focusOffset);
    }


    return (
        <textarea
            className={csx(styles.textArea)}
            placeholder="Type here..."
            value={text}
            maxLength={2000}
            ref={textAreaRef as any}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
        />
    );
};

export default InputComponent;