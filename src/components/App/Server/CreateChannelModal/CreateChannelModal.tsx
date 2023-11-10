import React, {useContext, useState} from 'react';
import styles from "./CreateChannelModal.module.scss"
import {ModalContext} from "../../Modal/Modal";
import csx from "classnames";
import {AppContext, SelectedServerContext} from "../../../../Contexts";

const CreateChannelModal = () => {
    const {getData} = useContext(AppContext)
    const {selectedServerId} = useContext(SelectedServerContext);
    if(!selectedServerId) throw new Error("selectedServerId can't be undefined at that point");
    const [title, setTitle] = useState<string>("");
    const {closeModal} = useContext(ModalContext);

    function handleCreate() {
        if(!title || !selectedServerId) return;
        getData.channels.createChannel(selectedServerId, title);
        closeModal();
    }

    return (
        <div className={styles.modal}>
            <h1>Create Channel</h1>
            <h2>Channel Type</h2>
            <div className={styles.channelType}>
                <img src={"icons/microscope.svg"} alt={"text channel"}/>
                <div className={styles.text}>
                    <p>Text channel</p>
                    <span>Send messages, images, GIF, emoji</span>
                </div>
            </div>
            <h2>Channel Name</h2>
            <div className={styles.input}>
                <img src={"icons/channel.svg"} alt={"channel"}/>
                <input
                    placeholder={"new-channel"}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div className={styles.buttons}>
                <div className={styles.button} onClick={closeModal}>Cancel</div>
                <div className={csx(styles.button, styles.create, {[styles.disabled]: title === ""})}
                     onClick={handleCreate}>Create</div>
            </div>
        </div>
    );
};

export default CreateChannelModal;