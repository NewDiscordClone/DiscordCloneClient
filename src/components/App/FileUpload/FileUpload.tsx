import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./FileUpload.module.scss";

type Props = {
    // children: ReactNode;
    onFilesDropped: (files: FileList) => void;
    instaUpload: (files: FileList) => void;
    chatName: string
}
const FileUpload = ({onFilesDropped, chatName, instaUpload}: Props) => {
    const [active, setActive] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isShift, setShift] = useState(false);

    const handleDragOver = (event: { preventDefault: () => void, shiftKey: boolean }) => {
        event.preventDefault();
        setIsDragOver(true);
        setShift(event.shiftKey)
    };
    const handleDrop = (event: { preventDefault: () => void, dataTransfer: DataTransfer | null, shiftKey: boolean }) => {
        handleDragLeave(event)
        const files = event.dataTransfer?.files

        if (files) {
            if (event.shiftKey)
                instaUpload(files)
            else
                onFilesDropped(files);
        }
    };
    const handleDragLeave = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setIsDragOver(false);
        setShift(false);
        setActive(false);
    };

    useEffect(() => {
        function onDragOver(){
            setActive(true);
        }
        function onDragLeave(){
            setActive(false);
        }

        window.addEventListener("dragover", onDragOver);
        window.addEventListener("dragleave", onDragLeave);
        return () => {
            window.removeEventListener("dragover", onDragOver);
            window.removeEventListener("dragleave", onDragLeave);
        }
    }, [])

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={csx(styles.backdrop, {[styles.active]: active, [styles.show]: isDragOver})}>
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