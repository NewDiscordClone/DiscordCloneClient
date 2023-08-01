import React, {useContext, useEffect, useState} from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import {GetDataContext} from "../../../Contexts";
import Server from "../../../models/Server";

const ServerColumn = () => {
    const getData = useContext(GetDataContext);
    const [servers, setServer] = useState<Server[]>(getData.servers);

    return (
        <div className={styles.serversColumn}>
            {servers.map(s => <ServerIcon key={s.id} server={s}/>)}
        </div>
    );
};

export default ServerColumn;