import {ModalPage} from "../CreateServerModal";
import appStyles from "../../../App.module.scss";
import styles from "../CreateServerModal.module.scss";
import pageStyles from "./CustomizePage.module.scss";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../../../../Contexts";
import CloseModalButton from "../../../CloseModalButton/CloseModalButton";

type Props = {
    setPage: (page: ModalPage) => void;
    create: (title: string, imageData: FormData | undefined) => void;
    close: () => void
    isOpen: boolean;
}
const CustomizePage = ({setPage, create, close, isOpen}: Props) => {
    const {user} = useContext(AppContext)
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File>();
    const [preview, setPreview] = useState<string | undefined>();
    const inputRef = useRef<HTMLInputElement>()

    useEffect(() => {
        setTitle(user.displayName ?? user.username + "'s server");
        setFile(undefined);
        setPreview(undefined);
    }, [isOpen, user.displayName, user.username])

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        // console.log(file);
        if (file && (
            file.name.toLowerCase().endsWith(".png") ||
            file.name.toLowerCase().endsWith(".jpg") ||
            file.name.toLowerCase().endsWith(".jpeg") ||
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
        }
        create(title, formData)
    }

    return (
        <div className={styles.content}>
            <CloseModalButton close={close} className={styles.closeButton}/>
            <h2 className={styles.title}>Customize your server</h2>
            <p className={pageStyles.text}>Give your new server a personality with a name and an icon. You can
                always
                change
                it later.</p>
            <div className={pageStyles.dropSection} onClick={handleClick}>
                <input type="file" style={{display: "none"}} ref={inputRef as any} onChange={handleUpload}/>
                <div className={pageStyles.imageContainer}>
                    <img src={preview ?? "icons/upload.svg"} alt={"upload icon"}/>
                </div>
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