import React, {useEffect, useState} from 'react';
import {EventP} from "../../../Events";
import csx from "classnames";
import styles from "./FileUpload.module.scss";

type Props = {
    // children: ReactNode;
    onFilesDropped: (files: FileList) => void;
    instaUpload: (files: FileList) => void;
    chatName: string
}
const FileUpload = ({onFilesDropped, chatName, instaUpload}: Props) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isShift, setShift] = useState(false);

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const files = event.dataTransfer?.files

        if (files) {
            if (event.shiftKey)
                instaUpload(files)
            else
                onFilesDropped(files);
        }
    };

    const handleDragOver = (event: { preventDefault: () => void, shiftKey: boolean }) => {
        event.preventDefault();
        setIsDragOver(true);
        setShift(event.shiftKey)
    };

    const handleDragLeave = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setIsDragOver(false);
        setShift(false);
    };

    useEffect(() => {

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop)
        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop)
        }
    }, [isDragOver, handleDrop])

    return (
        <div
            onDragLeave={handleDragLeave}
            className={csx(styles.backdrop, {[styles.active]: isDragOver})}>
            {isDragOver ?
                <div className={styles.modalWindow}>
                    <img src={"images/uploadFile.svg"} alt={"Upload"}/>
                    {isShift ?
                        <h1><b>Insta Upload </b>Mode!</h1> :
                        <h1>Upload to <b>{chatName}</b></h1>
                    }
                    <p>You can add comments before uploading. <br/>Hold shift to upload directly.</p>
                </div>
                : null}
        </div>
    );
};
export default FileUpload;