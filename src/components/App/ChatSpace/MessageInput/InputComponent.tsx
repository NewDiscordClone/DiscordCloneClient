import React, {useEffect, useRef} from 'react';
import csx from "classnames";
import styles from "./MessageInput.module.scss";

type Props = {
    text: string;
    setText: (text: string) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
}

// function handlePasteEmoji(text: string) {
//     if (!textAreaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection) return;
//
//     // If there is a selection, delete it
//     if (!selection.isCollapsed) {
//         selection.deleteFromDocument();
//     }
//     let range: Range;
//     if (selection.focusNode !== textAreaRef.current) {
//
//         selection.removeAllRanges();
//         range = document.createRange();
//         range.selectNodeContents(textAreaRef.current!);
//         // range.setStart(textAreaRef.current, 0);
//         range.collapse(true);
//         selection.addRange(range);
//     }
//
//     if (selection.rangeCount > 0) range = selection.getRangeAt(0);
//     else {
//         range = document.createRange();
//         range.setStart(textAreaRef.current, 0);
//         range.collapse(true);
//     }
//     range.deleteContents();
//     const node = document.createTextNode(text + " ");
//     const noneNode = document.createTextNode("");
//     range.insertNode(noneNode);
//     range.insertNode(node);
//     // Move the cursor after the inserted text
//     const newRange = new Range();
//     newRange.setStartAfter(noneNode);
//     newRange.collapse(true);
//
//     // Update the selection
//     selection.removeAllRanges();
//     selection.addRange(newRange);
// }

const InputComponent = ({text, setText, onSubmit, onCancel}: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>()

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
            // event.preventDefault();
            if(event.shiftKey){
                // setText(text + "\n");
                return;
            }
            if(onSubmit) {
                onSubmit();
                returnToDefault();
            }
        }
        if (event.key === "Escape" && onCancel) {
            event.preventDefault();
            onCancel();
        }
    }

    function childNodesToText(list: NodeListOf<ChildNode>): string {
        let result = '';
        list.forEach(node => {
            if (node.nodeType === 3) {
                // Text node
                result += (node as Text).nodeValue ?? '';
            } else if (node.nodeType === 1 && (node as Element).tagName.toLowerCase() === 'img') {
                // Image node
                const altText = (node as HTMLImageElement).getAttribute('alt');
                result += altText;
            }
        })
        return result;
    }

    const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        setText(childNodesToText(e.currentTarget.childNodes));
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "17px";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }

    return (
        <div
            className={csx(styles.textArea)}
            placeholder="Type here..."
            ref={textAreaRef as any}
            contentEditable={true}
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onInput={handleChange}
            onSelect={e => console.log(e)}
        >
            {text}
        </div>
    );
};

export default InputComponent;