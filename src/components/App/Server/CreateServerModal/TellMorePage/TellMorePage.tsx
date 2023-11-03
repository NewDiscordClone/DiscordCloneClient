import styles from "../CreateServerModal.module.scss";
import OptionVariant from "../OptionVariant";
import {ModalPage} from "../CreateServerModal";
import pageStyles from "./TellMorePage.module.scss";
import React from "react";
import CloseModalButton from "../../../CloseModalButton/CloseModalButton";

type Props = {
    setPage: (page: ModalPage) => void;
    close: () => void;
}
const TellMorePage = ({setPage, close}: Props) => {
    return (
        <div className={styles.content}>
            <CloseModalButton close={close} className={styles.closeButton}/>
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