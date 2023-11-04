import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from "./CreateServerModal.module.scss"
import appStyles from "../../App.module.scss"
import csx from "classnames";
import PickTemplatePage from "./PickTemplatePage/PickTemplatePage";
import TellMorePage from "./TellMorePage/TellMorePage";
import CustomizePage from "./CustomizePage/CustomizePage";
import {AppContext} from "../../../../Contexts";
import {ActionType} from "../../reducer";
import {ServerDetailsDto} from "../../../../models/ServerDetailsDto";
import {ModalContext} from "../../Modal/Modal";

export enum ModalPage {
    // invitation,
    template,
    purpose,
    appearance
}
export enum Template {
    Default,
    Gaming,
    Study,
    School,
    Friends,
}

type Props = {
    selectServer: (serverId: string | undefined) => void;
}
const CreateServerModal = ({selectServer}: Props) => {
    const {isOpen, closeModal} = useContext(ModalContext);
    const {getData, dispatch} = useContext(AppContext);
    const [page, setPage] = useState<ModalPage>(ModalPage.template);
    const [template, setTemplate] = useState<Template>(Template.Default);
    const [purpose, setPurpose] = useState<string>("ForFriends");

    useEffect(() => {
        setPage(ModalPage.template)
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
    }, [closeModal, isOpen]);
    
    let left = "-" + (page * 100) + "%";
    let height = "720px"
    switch (page) {
        // case ModalPage.invitation:
        //     break;
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
            getData.servers.createServer({title, image: image, template})
                .then(serverId => getData.servers.getServerDetails(serverId))
                .then((server: ServerDetailsDto) => {
                    dispatch({
                        type: ActionType.ServerDetails,
                        value: server
                    })
                    selectServer(server.id);
                });
        }

        if (imageData)
            getData.media.uploadMedia(imageData)
                .then(([image]) => createServer(title, image));
        else
            createServer(title, undefined)
        closeModal();
    }

    return (
        <>
            {isOpen &&
				<div className={styles.modalWindow} style={{height}}>
					<div className={styles.row} style={{left}}>
						{/*<PickTemplatePage setPage={setPage} close={closeModal}/>*/}
						<PickTemplatePage setTemplate={setTemplate} setPage={setPage} close={closeModal}/>
						<TellMorePage setPage={setPage} close={closeModal}/>
						<CustomizePage setPage={setPage} create={create} close={closeModal} isOpen={isOpen}/>
					</div>
				</div>
            }
        </>
    );
};

export default CreateServerModal;