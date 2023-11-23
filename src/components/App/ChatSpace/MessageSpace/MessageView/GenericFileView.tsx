import React from 'react';
import {MediaDetails} from "../../../../../models/MediaDetails";
import styles from "./GenericFileView.module.scss"

type Props = {
    details: MediaDetails & {url: string}
}
const GenericFileView = ({details} : Props) => {
    return (
        <div className={styles.details}>
            <div className={styles.iconContainer}>
                <img src={"icons/file.svg"} alt={"file"}/>
            </div>
            <a href={details.url} target="_blank" rel="noopener noreferrer">
                {details.fileName}
            </a>
        </div>
    );
};

export default GenericFileView;