import React, {ReactNode, useState} from 'react';
import {EventP} from "../../Events";
import {FilesDroppedContext} from "../../Contexts";

const FileUpload = ({children}: { children: ReactNode }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [dropEvent,] = useState(new EventP<FileList>())

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const files = event.dataTransfer.files

        dropEvent.invoke(files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <FilesDroppedContext.Provider value={dropEvent}>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {children}
            </div>
        </FilesDroppedContext.Provider>
    );
};
export default FileUpload;