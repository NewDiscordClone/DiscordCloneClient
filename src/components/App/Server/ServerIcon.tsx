import React from 'react';
import styles from "./Server.module.scss";
import ServerLookUp from "../../../models/ServerLookUp";
import csx from "classnames";


type Props = {
    server: ServerLookUp;
    isSelected: boolean;
    onServerClick: (serverId: string | undefined) => void;
}
const ServerIcon = ({server, isSelected, onServerClick}: Props) => {
    return (
        <div className={csx(styles.icon, {
            [styles.selected]: isSelected
        })}
             onClick={() => onServerClick(server.id)}>
            <span className={styles.tooltip}>{server.title}</span>
            <img src={server.image}
                 alt={"serverImage"}/>
        </div>
    );
};

export default ServerIcon;