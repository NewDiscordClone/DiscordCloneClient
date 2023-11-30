import csx from "classnames";
import styles from "./Server.module.scss";
import React, {useContext} from "react";
import {AppContext} from "../../../Contexts";
import {RelationshipType} from "../../../models/Relationship";

type Props = {
    isSelected: boolean;
    onServerClick: (serverId: string | undefined) => void;
}
const PrivateServerIcon = ({isSelected, onServerClick}: Props) => {
    const {relationships} = useContext(AppContext);

    const pendingAmount = relationships.filter(r =>
        r.type === RelationshipType.Pending &&
        r.isActive
    ).length
    return (
        <div style={{position: "relative"}}>
            <div className={csx(styles.icon, [styles.serverMainIcon], {[styles.selected]: isSelected})}
                 onClick={() => onServerClick(undefined)}>
                <span className={styles.tooltip}>Direct messages</span>
                <img src={"SparkleLogo.png"}
                     alt={"Direct Messages"}/>
            </div>
            {!isSelected && pendingAmount > 0 &&
				<div className={styles.unread}>
                    {pendingAmount}
				</div>
            }
        </div>
    );
};
export default PrivateServerIcon;