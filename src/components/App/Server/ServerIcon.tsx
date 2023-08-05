import React, {useContext} from 'react';
import styles from "./Server.module.scss";
import Server from "../../../models/Server";
import {SelectedServerContext} from "../../../Contexts";
import csx from "classnames";
import Channel from "../../../models/Channel";

const ServerIcon = ({server} : {server: Server & {selectedChannel : Channel} | undefined}) => {
    //TODO: Реалізація серверів

    const {serverSelected, selectedServer} = useContext(SelectedServerContext);
    return (
        <div className={csx(styles.serverIconContainer, {[styles.serverMainIcon]: server === undefined, [styles.selected]: selectedServer?.id === server?.id})} onClick={() => serverSelected.invoke(server)}>
            {
                server === undefined?
                    <img src={"DiscordLogo.png"}
                    alt={"MainButton"}
                    />:
                <img src={server.image}
                     alt={"serverImage"}/>
            }
        </div>
    );
};

export default ServerIcon;