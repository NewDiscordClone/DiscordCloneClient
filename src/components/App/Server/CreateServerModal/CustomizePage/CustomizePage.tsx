import {ModalPage} from "../CreateServerModal";
import appStyles from "../../../App.module.scss";
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./CustomizePage.module.scss";
import React, {useRef, useState} from "react";

type Props = {
    setPage: (page: ModalPage) => void;
    create: (title: string, imageData: FormData | undefined) => void;
    close: () => void
}
const CustomizePage = ({setPage, create, close}: Props) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File>();
    const [preview, setPreview] = useState<string | undefined>();
    const inputRef = useRef<HTMLInputElement>()
    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        // console.log(file);
        if (file && (
            file.name.toLowerCase().endsWith(".png") ||
            file.name.toLowerCase().endsWith(".jpg") ||
            file.name.toLowerCase().endsWith(".jpeg")||
            file.name.toLowerCase().endsWith(".gif") ||
            file.name.toLowerCase().endsWith(".webp"))) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result)
                    setPreview(reader.result.toString());
            };
            reader.readAsDataURL(file);
            setFile(file);
        }
    }
    function handleClick() {
        inputRef.current?.click();
    }
    function handleCreate() {
        let formData: FormData | undefined = undefined;
        if (file) {
            formData = new FormData();
            formData.append('file', file);
            return formData;
        }
        create(title, formData)
    }

    return (
        <div className={styles.content}>
            <svg
                className={styles.closeButton}
                width="17" height="17"
                viewBox="0 0 17 17"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={close}>
                <path id="Vector"
                      d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z"
                      fill="currentColor"/>
            </svg>
            <h2 className={styles.title}>Customize your server</h2>
            <p className={pageStyles.text}>Give your new server a personality with a name and an icon. You can always
                change
                it later.</p>
            <div className={pageStyles.dropSection} onClick={handleClick}>
                <input type="file" style={{display: "none"}} ref={inputRef as any} onChange={handleUpload}/>
                <img src={preview ?? "icons/upload.svg"} alt={"upload icon"}/>
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
                <div className={pageStyles.button} onClick={handleCreate}>
                    Create
                </div>
            </div>

        </div>
    );
};
export default CustomizePage;