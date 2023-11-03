import React, { useContext } from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import {AppContext, SelectedServerContext} from "../../../Contexts";
import PrivateServerIcon from "./PrivateServerIcon";
import AddServerIcon from "./AddServerIcon";

type Props = {
    selectedServer: string | undefined;
}
const ServerColumn = ({selectedServer} : Props) => {
    const {servers} = useContext(AppContext);
    const {selectServer} = useContext(SelectedServerContext);

    return (
        <div className={styles.serversColumn}>
            <PrivateServerIcon isSelected={selectedServer === undefined} onServerClick={selectServer}/>
            {Object.values(servers).filter(s => s.id).map(s =>
                <ServerIcon
                    key={s.id}
                    server={s}
                    isSelected={selectedServer === s.id}
                    onServerClick={selectServer}/>)}
            <AddServerIcon selectServer={selectServer}/>
        </div>
    );
};

export default ServerColumn;