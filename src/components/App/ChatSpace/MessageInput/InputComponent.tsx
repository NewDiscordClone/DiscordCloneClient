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

const InputComponent = ({text, setText, onSubmit, onCancel, emojiPasteEvent}: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const [selectionOffset, setSelectionOffset] = useState<number | null>(null);

    useEffect(() => {
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
            // event.preventDefault();
            if (event.shiftKey) {
                // setText(text + "\n");
                return;
            }
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

    // const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    //     setText(childNodesToText(e.currentTarget.childNodes));
    //     if (textAreaRef.current) {
    //         textAreaRef.current.style.height = "17px";
    //         textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    //     }
    // }
    const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
        console.log("before input")
        const selection = window.getSelection();

        function getNodeIndex(node: Node | null): number {
            if (!node) {
                console.warn("return: 0 (no node)")
                return 0;
            }
            const parent = textAreaRef.current;
            if (!parent) {
                console.warn("return: 0 (no parent)")
                return 0;
            }

            let offsetWidth = 0;
            for (let i = 0; i < parent.childNodes.length; i++) {
                const iterNode = textAreaRef.current?.childNodes[i] as any
                if (iterNode === node) {
                    console.log("return: " + offsetWidth)
                    return offsetWidth;
                }
                const length = iterNode.length ?? 2;
                offsetWidth += length;
            }

            console.warn("return: 0 (not found)")
            return 0;
        }


        if (selection) {
            // if(!selection.isCollapsed)
            //     selection.deleteFromDocument();
            const offset = selection.focusOffset;

            // console.log(e);
            setSelectionOffset(
                getNodeIndex(selection.focusNode) +
                offset
                // - (e.nativeEvent as unknown as {data: string}).data.length + 1
            );
        }
        setText(childNodesToText(e.currentTarget.childNodes));
    }

    useEffect(() => {
        console.log('text updated')
        if (textAreaRef.current && selectionOffset !== null) {
            const selection = window.getSelection();
            if (!selection) return;
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : document.createRange();
            console.log(textAreaRef.current?.innerHTML);
            let calcOffset = 0;
            for (let i = 0; i < textAreaRef.current?.childNodes.length; i++) {
                const node = textAreaRef.current?.childNodes[i] as any
                const length = node.length ?? 2;
                const isEmoji = !node.length;
                if (length + calcOffset < selectionOffset || (length + calcOffset === selectionOffset && isEmoji)) {
                    calcOffset += length;
                    console.log(`[${i}] + ${length} = ${calcOffset}`)
                } else if (selectionOffset === calcOffset && i > 0) {
                    console.log(`[${i}] set selection between at ${i} from max ${textAreaRef.current?.childNodes.length}`)
                    range.setStart(textAreaRef.current, i);
                    break;
                } else {
                    console.log(`[${i}] set selection ${selectionOffset - calcOffset} from max ${length}`)
                    range.setStart(node, selectionOffset - calcOffset);
                    break;
                }
            }
            if (textAreaRef.current?.childNodes.length === 0) {
                range.setStart(textAreaRef.current, 0);
            }
            range.collapse(true);
            if (selection.rangeCount === 0) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
            console.log(selection.focusNode)
            console.log(selection.focusOffset)
        }
    }, [text])

    function handlePasteEmoji(char: string) {

    }

    return (
        <div
            className={csx(styles.textArea)}
            placeholder="Type here..."
            ref={textAreaRef as any}
            contentEditable={true}
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            // onInput={handleInput}
            onBeforeInput={handleChange}
        >
            {text}
        </div>
    );
};

export default InputComponent;