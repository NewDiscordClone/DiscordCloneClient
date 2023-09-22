import React from 'react';
import styles from './RelationshipSpace.module.scss'
import {Relationship} from "../../../models/Relationship";
import csx from "classnames";
import {UserStatus} from "../../../api/GetServerData";

type Props = {
    relationship: Relationship;
}
const RelationshipUser = ({relationship}: Props) => {

    let textStatus = relationship.user.textStatus
    if(!textStatus)
        switch (relationship.user.status) {
            case UserStatus.Online:
                textStatus = "ONLINE"
                break;
            case UserStatus.Idle:
                textStatus = "IDLE"
                break;
            case UserStatus.DoNotDisturb:
                textStatus = "DO NOT DISTURB"
                break;
            case UserStatus.Offline:
                textStatus = "OFFLINE"
                break;
            default:
                break;
        }
    return (
        <li className={styles.item}>
            <div className={styles.iconContainer}>
                <img src={relationship.user.avatar} alt={"UserImage"}/>
            </div>
            <div className={csx(styles.content)}>
                <strong>{relationship.user.displayName}</strong>
                <div>
                    <span>{textStatus}</span>
                </div>
            </div>
        </li>
    );
};

export default RelationshipUser;