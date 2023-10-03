import styles from "../CreateServerModal.module.scss";
import OptionVariant from "../OptionVariant";
import {ModalPage} from "../CreateServerModal";
import pageStyles from "./TellMorePage.module.scss";
import React from "react";

type Props = {
    setPage: (page: ModalPage) => void;
    close: () => void;
}
const TellMorePage = ({setPage, close}: Props) => {
    return (
        <div className={styles.content}>
            <svg
                className={styles.closeButton}
                width="17" height="17"
                viewBox="0 0 17 17"
                fill="none" xmlns="http://www.w3.org/2000/svg" onClick={close}>
                <path id="Vector" d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z" fill="currentColor"/>
            </svg>
            <h2 className={styles.title}>Tell us more about your server</h2>
            <p className={styles.text}>In order to help you with your setup, is you new server for
                just a few friends or a larger community</p>
            <OptionVariant text={"For me and my friends"} image={"images/forFriends.png"}
                           onClick={() => setPage(ModalPage.appearance)}/>
            <OptionVariant text={"For a club or community"} image={"images/forClub.png"}
                           onClick={() => setPage(ModalPage.appearance)}/>
            <p className={pageStyles.notSure}>Not Sure? You can <a onClick={() => {setPage(ModalPage.appearance)}}>skip this question</a> for now.</p>
            <div className={pageStyles.back} onClick={() => setPage(ModalPage.template)}>
                Back
            </div>
        </div>
    );
};
export default TellMorePage;