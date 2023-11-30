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
            [styles.selected]: isSelected,
            [styles.serverMainIcon]: !server.image
        })}
             onClick={() => onServerClick(server.id)}>
            <span className={styles.tooltip}>{server.title}</span>
            {server.image ?
                <img src={server.image}
                     alt={"serverImage"}/> :
                <div className={styles.textContainer}>
                    <h1>{(server.title as string).slice(0, 2)}</h1>
                </div>
            }
        </div>
    );
};

export default ServerIcon;