import React, {useEffect, useState} from 'react';
import styles from "./MessageInput.module.scss"

const AttachmentPreview = ({file}: { file: File }) => {
    const [preview, setPreview] = useState<string | undefined>();

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result)
                setPreview(reader.result.toString());
        };
        reader.readAsDataURL(file);

    }, [file, preview])

    return (
        <div className={styles.attachment}>
            {preview ?
                <div className={styles.imageContainer}>
                    <img
                        src={preview}
                        alt="Attachment"
                    />
                </div>
                : null
            }
            <div className={styles.textContainer}>
                {file.name}
            </div>
        </div>
    );
};

export default AttachmentPreview;