import React, {useEffect, useState} from 'react';
import styles from "./MessageInput.module.scss"
import {AttachmentToSend} from "./AttachmentToSend";
import csx from "classnames";

type Props = {
    attachment: AttachmentToSend;
    removeAttachment: () => void;
    setSpoiler: (value: boolean) => void;
}
const AttachmentPreview = ({attachment, removeAttachment, setSpoiler}: Props) => {
    const [preview, setPreview] = useState<string | undefined>();

    useEffect(() => {
        if (attachment.file.name.toLowerCase().endsWith(".png") ||
            attachment.file.name.toLowerCase().endsWith(".jpg") ||
            attachment.file.name.toLowerCase().endsWith(".jpeg") ||
            attachment.file.name.toLowerCase().endsWith(".gif") ||
            attachment.file.name.toLowerCase().endsWith(".webp")) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result)
                    setPreview(reader.result.toString());
            };
            reader.readAsDataURL(attachment.file);
        }

    }, [attachment, preview])

    return (
        <div className={styles.attachment}>
            <div className={styles.buttonContainer}>
                <div className={styles.button}>
                    <svg width="17" height="17"
                         viewBox="0 0 17 17"
                         onClick={removeAttachment}>
                        <path id="Vector"
                              d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z"
                              fill="currentColor"/>
                    </svg>
                </div>
                <div className={styles.button} onClick={() => setSpoiler(!attachment.isSpoiler)}>
                    {attachment.isSpoiler ?
                        <svg className="actionBarIcon-2vVzNZ" aria-hidden="true" role="img" width="17" height="17"
                             viewBox="0 0 24 24">
                            <rect fill="#F1930F" x="2" y="21.2154" width="26" height="2"
                                  transform="rotate(-45 2 21.2154)"></rect>
                            <path fill="currentColor"
                                  d="M10.1843 18.8115C10.7713 18.9328 11.3775 19 12 19C18.352 19 23 12 23 12C23 12 21.9643 10.4402 20.2026 8.79322L15.8265 13.1693C15.4393 14.4384 14.4382 15.4393 13.1694 15.8264L10.1843 18.8115ZM12.4818 8.02871C12.3238 8.00975 12.1631 8 12 8C9.791 8 8 9.79 8 12C8 12.1631 8.00975 12.3239 8.0287 12.4818L4.59645 15.914C2.35293 14.0375 1 12 1 12C1 12 5.648 5 12 5C13.0508 5 14.055 5.19157 14.9992 5.51132L12.4818 8.02871Z"></path>
                        </svg>
                        :
                        <svg role="img" width="17" height="17"
                             viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z"></path>
                            <path fill="currentColor"
                                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path>
                        </svg>
                    }

                </div>
            </div>
            {
                preview ?
                    <div className={csx(styles.imageContainer)}>
                        <img
                            className={csx({[styles.spoiler]: attachment.isSpoiler})}
                            src={preview}
                            alt="Attachment"
                        />
                    </div>
                    : null
            }
            <div className={styles.textContainer}>
                {attachment.file.name}
            </div>
        </div>
    )
        ;
};

export default AttachmentPreview;