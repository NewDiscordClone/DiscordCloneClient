import React from 'react';
import {MetaData} from "./getMetadata";
import styles from "./EmbedAttachment.module.scss"

type Props = {
    metadata: MetaData;
}
const EmbedAttachment = ({metadata}: Props) => {

    console.log(metadata);
    return (
        <div className={styles.container}>
            <div className={styles.color} style={{backgroundColor: metadata.themeColor}}/>
            <div className={styles.grid}>
                {metadata.provider && metadata.siteName &&
					<a
						className={styles.provider}
						href={metadata.provider}
						target="_blank"
						rel="noopener noreferrer"
					>
                        {metadata.siteName}
					</a>
                }
                <a
                    className={styles.title}
                    href={metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {metadata.title ?? metadata.provider ?? metadata.url}
                </a>
                {metadata.description &&
					<div className={styles.description}>
                        {metadata.description}
					</div>
                }
                {metadata.image &&
					<div className={styles.imageContainer}>
						<img src={metadata.image} alt={metadata.title}/>
					</div>
                }
            </div>
        </div>
    );
};

export default EmbedAttachment;