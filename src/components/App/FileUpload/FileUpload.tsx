import React, {useEffect, useRef, useState} from 'react';
import csx from "classnames";
import styles from "./FileUpload.module.scss";
// import addStyles from "./FileUpload.module.scss";
import addStyles from "../App.module.scss";

const MAX_FILE_SIZE_MB = 10;

const checkFileSize = (files: FileList | File[]) => {
    for (let i = 0; i < files.length; i++) {
        const fileSizeMB = files[i].size / (1024 * 1024); // Convert file size to megabytes
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return false; // File size exceeds the limit
        }
    }
    return true; // All files are within the size limit
};

type Props = {
    // children: ReactNode;
    onFilesDropped: (files: FileList | File[]) => void;
    instaUpload: (files: FileList) => void;
    chatName: string
    imitateFiles: [File[], React.Dispatch<React.SetStateAction<File[]>>]
}
const FileUpload = ({
                        onFilesDropped, chatName, instaUpload,
                        imitateFiles: [imitateFilesDropped, setImitateFilesDropped]
                    }: Props) => {
    const [active, setActive] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isShift, setShift] = useState(false);
    const [isMoreThanLimit, setMoreThanLimit] = useState(false);
    const errorModal = useRef<HTMLDivElement>();

    const handleDragOver = (event: { preventDefault: () => void, shiftKey: boolean }) => {
        event.preventDefault();
        if (isMoreThanLimit) return;
        setIsDragOver(true);
        setShift(event.shiftKey)
        // console.log("set true handle");
    };

    const handleDrop = (event: { preventDefault: () => void, dataTransfer: DataTransfer | null, shiftKey: boolean }) => {
        event.preventDefault();
        setShift(false);
        const files = event.dataTransfer?.files

        if (files) {
            if (checkFileSize(files)) {
                if (event.shiftKey)
                    instaUpload(files)
                else
                    onFilesDropped(files);
                setIsDragOver(false);
                setActive(false);
            } else {
                setMoreThanLimit(true);
                setShift(false);
                setIsDragOver(false);
            }
        }
    };

    useEffect(() => {
        if(imitateFilesDropped.length > 0) {
            if (checkFileSize(imitateFilesDropped)) {
                onFilesDropped(imitateFilesDropped);
                setIsDragOver(false);
                setActive(false);
            } else {
                setActive(true);
                setMoreThanLimit(true);
                setShift(false);
                setIsDragOver(false);
            }

            setImitateFilesDropped([])
        }
    }, [imitateFilesDropped])
    const handleDragLeave = (event?: { preventDefault: () => void }) => {
        event?.preventDefault();
        setShift(false);
        setIsDragOver(false);
        setActive(false);
        setMoreThanLimit(false);
        // console.log("set false handle");
    };

    useEffect(() => {
        function onDragOver(e: DragEvent) {
            if (isMoreThanLimit) return;
            if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files'))
                setActive(true);
        }


        document.addEventListener("dragover", onDragOver);
        return () => {
            document.removeEventListener("dragover", onDragOver);
        }
    }, [])

    useEffect(() => {
        if (isMoreThanLimit) {
            document.addEventListener("click", () => handleDragLeave())
        }
        return document.removeEventListener("click", () => handleDragLeave())
    }, [isMoreThanLimit])

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            className={csx(addStyles.backdrop, {[addStyles.active]: active, [addStyles.show]: isDragOver})}
            style={{zIndex: "990"}}
        >
            {isDragOver &&
				<div className={styles.modalWindow}>
					<img src={"images/uploadFile.svg"} alt={"Upload"}/>
                    {isShift ?
                        <h1><b>Insta Upload </b>Mode!</h1> :
                        <h1>Upload to <b>{chatName}</b></h1>
                    }
					<p>You can add comments before uploading. <br/>Hold shift to upload directly.</p>
				</div>
            }
            {isMoreThanLimit &&
				<div className={csx(styles.modalWindow, styles.shake)} ref={errorModal as any}>
					<img src={"images/uploadFile.svg"} alt={"Upload"}/>
					<h1 className={styles.error}>Your Files Is <b>Too Big!</b></h1>
					<p>The max file size is {MAX_FILE_SIZE_MB} MB.</p>
				</div>
            }
        </div>
    );
};
export default FileUpload;