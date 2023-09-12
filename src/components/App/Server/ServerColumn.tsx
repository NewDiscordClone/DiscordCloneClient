import React, { useContext } from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import { AppContext } from "../../../Contexts";
import TestButtons from "../../TestButtons";
import PrivateServerIcon from "./PrivateServerIcon";

type Props = {
    selectedServer: string | undefined;
    onServerClick: (serverId: string | undefined) => void;
}
const ServerColumn = ({selectedServer, onServerClick} : Props) => {
    const {servers} = useContext(AppContext);

    return (
        <div className={styles.serversColumn}>
            <PrivateServerIcon isSelected={selectedServer === undefined} onServerClick={onServerClick}/>
            {servers.map(s => <ServerIcon key={s.id} server={s} isSelected={selectedServer === s.id} onServerClick={onServerClick}/>)}
        </div>
    );
};

export default ServerColumn;