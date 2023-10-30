import React, {ReactElement, useContext, useEffect, useState} from 'react';
import styles from "./EmbedAttachment.module.scss"
import {AppContext} from "../../../../../Contexts";
import {MetaData} from "../../../../../models/MetaData";

type Props = {
    metadata: MetaData;
}
const EmbedAttachment = ({metadata}: Props) => {
    const {media} = useContext(AppContext);

    // console.log(metadata);
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
						<img src={media[metadata.image] as string} alt={metadata.title}/>
					</div>
                }
            </div>
        </div>
    );
};

export default EmbedAttachment;