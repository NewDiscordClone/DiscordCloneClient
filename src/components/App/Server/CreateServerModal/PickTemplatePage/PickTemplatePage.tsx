import React from 'react';
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./PickTemplatePage.module.scss";
import OptionVariant from "../OptionVariant";
import {ModalPage} from "../CreateServerModal";

type Props = {
    setPage: (page: ModalPage) => void;
}

const PickTemplatePage = ({setPage}: Props) => {
    return (
        <div className={styles.content}>
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
                 onClick={() => setPage(ModalPage.invitation)}>
                Join a Server
            </div>
        </div>
    );
};

export default PickTemplatePage;