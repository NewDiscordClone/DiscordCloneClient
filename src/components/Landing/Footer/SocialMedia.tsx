import React from 'react';
import styles from "./Footer.module.scss";
const SocialMedia = () => {
    return (
        <div className={styles.mediaSection}>
            <img src={"icons/twitter.svg"} alt={"twitter"}/>
            <img src={"icons/instagram.svg"} alt={"instagram"}/>
            <img src={"icons/facebook.svg"} alt={"facebook"}/>
            <img src={"icons/youtube.svg"} alt={"youtube"}/>
        </div>
    );
};

export default SocialMedia;