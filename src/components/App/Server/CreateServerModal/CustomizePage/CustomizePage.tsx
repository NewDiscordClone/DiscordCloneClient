import {ModalPage} from "../CreateServerModal";
import appStyles from "../../../App.module.scss";
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./CustomizePage.module.scss";
import React, {useState} from "react";

type Props = {
    setPage: (page: ModalPage) => void;
    create: (title: string, imageData: FormData | undefined) => void;
}
const CustomizePage = ({setPage, create}: Props) => {
    const [title, setTitle] = useState("");
    const [formData, setFormData] = useState<FormData>();

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const file = event.dataTransfer.files.item(0);
        // console.log(file);
        if (file)
            setFormData(() => {
                const newFormData = new FormData();
                newFormData.append('file', file);
                return newFormData;
            })

    }

    return (
        <div className={styles.content}>
            <h2 className={styles.title}>Customize your server</h2>
            <p className={pageStyles.text}>Give your new server a personality with a name and an icon. You can always
                change
                it later.</p>
            <div className={pageStyles.dropSection} onDrop={handleDrop}>
                <img src={"icons/upload.svg"} alt={"upload icon"}/>
            </div>
            <p className={pageStyles.serverName}>SERVER NAME</p>
            <input
                type={"text"}
                maxLength={100}
                className={appStyles.customInput}
                style={{backgroundColor: "#4F4F4F", width: "100%"}}
                value={title}
                onChange={({target: {value}}) => setTitle(value)}/>
            <p className={pageStyles.agreement}>By creating a server, you agree to Sparkle’s <a>Community
                Guidelines.</a></p>
            <div className={pageStyles.row}>
                <div className={pageStyles.back} onClick={() => setPage(ModalPage.purpose)}>
                    Back
                </div>
                <div className={pageStyles.button} onClick={() => create(title, formData)}>
                    Create
                </div>
            </div>

        </div>
    );
};
export default CustomizePage;