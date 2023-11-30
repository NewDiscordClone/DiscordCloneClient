import React from 'react';
import styles from "./LoadingPage.module.scss"
const LoadingPage = () => {
    return (
        <div className={styles.container}>
            <video autoPlay loop muted>
                <source src={"LoadingVideo.mp4"} type={"video/mp4"}/>
            </video>
            <h1>Loading...</h1>
        </div>
    );
};

export default LoadingPage;