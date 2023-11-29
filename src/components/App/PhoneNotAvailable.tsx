import React from 'react';
import styles from './PhoneNotAvailable.module.scss'
import {useNavigate} from "react-router-dom";
const PhoneNotAvailable = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.page}>
            <div className={styles.row}>
                <img src={"icons/phone-unavailable.svg"} alt={"phone is unavailable"}/>
                <h1>Phone is not Available yet</h1>
            </div>
            <p>
                You can open Sparkle with your PC or <a onClick={() => navigate("/")}>go to the main page</a>
            </p>
        </div>
    );
};

export default PhoneNotAvailable;