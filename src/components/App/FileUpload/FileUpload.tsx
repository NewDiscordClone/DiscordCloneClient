import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./FileUpload.module.scss";
// import addStyles from "./FileUpload.module.scss";
import addStyles from "../App.module.scss";

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
        console.log("set true handle");
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
        console.log("drop");
    };
    const handleDragLeave = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setIsDragOver(false);
        setShift(false);
        setActive(false);
        console.log("set false handle");
    };

    useEffect(() => {
        function onDragOver() {
            setActive(true);
            console.log("set true");
        }

        // function onDragLeave(){
        //     setActive(false);
        //     console.log("set false");
        // }

        document.addEventListener("dragover", onDragOver);
        // document.addEventListener("dragleave", onDragLeave);
        return () => {
            document.removeEventListener("dragover", onDragOver);
            // document.removeEventListener("dragleave", onDragLeave);
        }
    }, [])

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={csx(addStyles.backdrop, {[addStyles.active]: active, [addStyles.show]: isDragOver})}
            style={{zIndex: "997"}}
        >
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