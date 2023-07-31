import React from 'react';
import styles from "./Server.module.scss";
import Server from "../../../models/Server";

const ServerIcon = ({server} : {server: Server}) => {
    return (
        <div className={styles.serverIconContainer}>
            <img src={server.image}/>
        </div>
    );
};

export default ServerIcon;