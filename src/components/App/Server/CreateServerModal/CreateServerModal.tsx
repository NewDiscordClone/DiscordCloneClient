import React, {useContext, useEffect, useState} from 'react';
import styles from "./CreateServerModal.module.scss"
import styles2 from "./CreateServerModal.module.scss"
import csx from "classnames";
import PickTemplatePage from "./PickTemplatePage/PickTemplatePage";
import TellMorePage from "./TellMorePage/TellMorePage";
import CustomizePage from "./CustomizePage/CustomizePage";
import {AppContext} from "../../../../Contexts";
import {ActionType} from "../../reducer";
import {ServerDetailsDto} from "../../../../models/ServerDetailsDto";

export enum ModalPage {
    invitation,
    template,
    purpose,
    appearance
}

type Props = {
    isOpen: boolean
    setOpen: (value: boolean) => void;
    selectServer: (serverId: string | undefined) => void;
}
const CreateServerModal = ({isOpen, setOpen, selectServer}: Props) => {
    const {getData, dispatch} = useContext(AppContext);
    const [page, setPage] = useState<ModalPage>(ModalPage.template);
    const [template, setTemplate] = useState<string>("CreateMyOwn");
    const [purpose, setPurpose] = useState<string>("ForFriends");
    const [name, setName] = useState<string>("");

    const handleBackdropClick = (event: any) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        const handleEscapeKeyPress = (event: any) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKeyPress);
        } else {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, [isOpen]);
    const closeModal = () => {
        setOpen(false);
    };
    let left = "-" + (page * 100) + "%";
    let height = "720px"
    switch (page) {
        case ModalPage.invitation:
            break;
        case ModalPage.template:
            height = "715px"
            break;
        case ModalPage.purpose:
            height = "400px"
            break;
        case ModalPage.appearance:
            height = "390px"
            break;
    }

    function create(title: string, imageData: FormData | undefined) {
        function createServer(title: string, image: string | undefined) {
            getData.servers.createServer({title, image: image})
                .then(serverId => getData.servers.getServerDetails(serverId))
                .then((server: ServerDetailsDto) => {
                    dispatch({
                        type: ActionType.ServerSaved,
                        value: server
                    })
                    selectServer(server.id);
                });
        }

        //TODO: Реалізувати передачу Template і Purpose
        if (imageData)
            getData.media.uploadMedia(imageData)
                .then(([image]) => createServer(title, image));
        else
            createServer(title, undefined)
        setOpen(false);
    }

    return (
        <div className={csx(styles2.backdrop, {[styles2.active]: isOpen})} onClick={handleBackdropClick}>
            <div className={styles.modalWindow} style={{height}}>
                <div className={styles.row} style={{left}}>
                    <PickTemplatePage setPage={setPage}/>
                    <PickTemplatePage setPage={setPage}/>
                    <TellMorePage setPage={setPage}/>
                    <CustomizePage setPage={setPage} create={create}/>
                </div>
            </div>
        </div>
    );
};

export default CreateServerModal;