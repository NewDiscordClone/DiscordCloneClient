import React from 'react';
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./PickTemplatePage.module.scss";
import OptionVariant from "../OptionVariant";
import {ModalPage} from "../CreateServerModal";

type Props = {
    setPage: (page: ModalPage) => void;
    close: () => void
}

const PickTemplatePage = ({setPage, close}: Props) => {
    return (
        <div className={styles.content}>
            <svg
                className={styles.closeButton}
                width="17" height="17"
                viewBox="0 0 17 17"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={close}>
                <path id="Vector" d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z" fill="currentColor"/>
            </svg>
            <h2 className={styles.title}>Create a server</h2>
            <p className={styles.text}>Your server is where you and your friends hang out. Make yours and start
                talking.</p>
            <OptionVariant text={"Create My Own"} image={"images/createMyOwn.png"}
                           onClick={() => setPage(ModalPage.purpose)}/>
            <div className={pageStyles.templateText}>START FROM A TEMPLATE</div>
            <OptionVariant text={"Games"} image={"images/games.png"}
                           onClick={() => setPage(ModalPage.purpose)}/>
            <OptionVariant text={"School Club"} image={"images/education.png"}
                           onClick={() => setPage(ModalPage.purpose)}/>
            <OptionVariant text={"Study Club"} image={"images/studyClub.png"}
                           onClick={() => setPage(ModalPage.purpose)}/>
            <OptionVariant text={"Friends"} image={"images/friends.png"}
                           onClick={() => setPage(ModalPage.purpose)}/>
            <p className={pageStyles.haveAlready}>Have an invite already?</p>
            <div className={pageStyles.button} style={{height: "35px", margin: "0 0"}}
                 onClick={() => ({/*setPage(ModalPage.invitation*/})}>
                Join a Server
            </div>
        </div>
    );
};

export default PickTemplatePage;