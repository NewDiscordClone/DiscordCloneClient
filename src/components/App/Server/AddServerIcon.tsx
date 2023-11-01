import csx from "classnames";
import styles from "./Server.module.scss";
import styles2 from "./CreateServerModal/CreateServerModal.module.scss";
import React, {useContext, useEffect, useState} from "react";
import CreateServerModal from "./CreateServerModal/CreateServerModal";
import {AppContext} from "../../../Contexts";
import Modal from "../Modal/Modal";

type Props = {
    selectServer: (serverId: string | undefined) => void;
}
const PrivateServerIcon = ({selectServer}: Props) => {
    const {servers} = useContext(AppContext);
    const [isOpen, setOpen] = useState(false);
    const [createdServer, setCreatedServer] = useState<string | undefined>(undefined);

    useEffect(() => {
        if(createdServer && servers[createdServer]){
            selectServer(createdServer);
            setCreatedServer(undefined);
        }
    }, [createdServer, servers, selectServer])

    return (
        <>
            <div className={csx(styles.icon, [styles.addServerIcon])}
                 onClick={() => setOpen(true)}>
                <span className={styles.tooltip}>Add a server</span>
                <div className={styles.iconContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                        <rect x="10" width="2" height="22" rx="1"/>
                        <rect y="10" width="22" height="2" rx="1"/>
                    </svg>
                </div>
            </div>
            <Modal isOpen={isOpen} setOpen={setOpen}>
                <CreateServerModal selectServer={setCreatedServer}/>
            </Modal>
        </>
    );
};
export default PrivateServerIcon;