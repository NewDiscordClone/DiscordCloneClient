import React from 'react';
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./PickTemplatePage.module.scss";
import OptionVariant from "../OptionVariant";
import {ModalPage, Template} from "../CreateServerModal";
import CloseModalButton from "../../../CloseModalButton/CloseModalButton";

type Props = {
    setTemplate: (template: Template) => void;
    setPage: (page: ModalPage) => void;
    close: () => void
}

const PickTemplatePage = ({setTemplate, setPage, close}: Props) => {

    function onOptionClick(template: Template) {
        setTemplate(template);
        setPage(ModalPage.purpose)
    }

    return (
        <div className={styles.content}>
            <CloseModalButton close={close}  className={styles.closeButton}/>
            <h2 className={styles.title}>Create a server</h2>
            <p className={styles.text}>Your server is where you and your friends hang out. Make yours and start
                talking.</p>
            <OptionVariant text={"Create My Own"} image={"images/createMyOwn.png"}
                           onClick={() => onOptionClick(Template.Default)}/>
            <div className={pageStyles.templateText}>START FROM A TEMPLATE</div>
            <OptionVariant text={"Games"} image={"images/games.png"}
                           onClick={() => onOptionClick(Template.Gaming)}/>
            <OptionVariant text={"School Club"} image={"images/education.png"}
                           onClick={() => onOptionClick(Template.School)}/>
            <OptionVariant text={"Study Club"} image={"images/studyClub.png"}
                           onClick={() => onOptionClick(Template.Study)}/>
            <OptionVariant text={"Friends"} image={"images/friends.png"}
                           onClick={() => onOptionClick(Template.Friends)}/>
            <p className={pageStyles.haveAlready}>Have an invite already?</p>
            <div className={pageStyles.button} style={{height: "35px", margin: "0 0"}}
                 onClick={() => ({/*setPage(ModalPage.invitation*/})}>
                Join a Server
            </div>
        </div>
    );
};

export default PickTemplatePage;