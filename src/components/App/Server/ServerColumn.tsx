import React, { useContext } from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import { AppContext } from "../../../Contexts";
import TestButtons from "../../TestButtons";

const ServerColumn = () => {
    const { servers, getData } = useContext(AppContext);

    return (
        <div className={styles.serversColumn}>
            <ServerIcon key={-1} server={undefined} />
            {servers.map(s => <ServerIcon key={s.id} server={s} />)}
            <TestButtons/>
        </div>
    );
};

export default ServerColumn;