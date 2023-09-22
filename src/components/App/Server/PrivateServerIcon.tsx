import csx from "classnames";
import styles from "./Server.module.scss";
import React from "react";

type Props = {
    isSelected: boolean;
    onServerClick: (serverId: string | undefined) => void;
}
const PrivateServerIcon = ({isSelected, onServerClick}: Props) => {
    return (
        <div className={csx(styles.icon, [styles.serverMainIcon], {[styles.selected]: isSelected})}
             onClick={() => onServerClick(undefined)}>
            <span className={styles.tooltip}>Direct messages</span>
            {/*there should be an icon*/}
        </div>
    );
};
export default PrivateServerIcon;