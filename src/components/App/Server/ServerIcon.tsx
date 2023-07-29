import React from 'react';
import styles from "./Server.module.scss";
import Server from "../../../models/Server";

const ServerIcon = ({server} : {server: Server}) => {
    return (
        <div className={styles.serverContainer}>
            <img src={server.image} className={styles.serverImage}/>
        </div>
    );
};

export default ServerIcon;