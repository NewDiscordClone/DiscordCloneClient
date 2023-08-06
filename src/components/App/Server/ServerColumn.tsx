import React, { useContext } from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import { AppContext } from "../../../Contexts";
import { signoutRedirect } from '../../../auth/user-service';

const ServerColumn = () => {
    const { servers } = useContext(AppContext);
    return (
        <div className={styles.serversColumn}>
            <ServerIcon key={-1} server={undefined} />
            {servers.map(s => <ServerIcon key={s.id} server={s} />)}
            <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        </div>
    );
};

export default ServerColumn;