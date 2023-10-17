import React from 'react';
import {UserLookUp} from "../../../models/UserLookUp";
import styles from "./SelectFriendsPopUp.module.scss"
import csx from "classnames";

type Props = {
    user: UserLookUp & {userName: string};
    isSelected: boolean;
    setSelect: (value: boolean) => void;
}
const UserCheckBox = ({user, isSelected, setSelect}: Props) => {
    return (
        <div className={styles.friend} onClick={() => setSelect(!isSelected)}>
            <div className={styles.avatarContainer}>
                <img src={user.avatar} alt={"avatar"}/>
            </div>
            <h3>{user.displayName}</h3>
            <span>{user.userName}</span>
            <div className={csx(styles.iconContainer, {[styles.selected]: isSelected})}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="currentColor"/>
                    {isSelected ?
                        <rect x="3" y="3" width="14" height="14" rx="3" fill="currentColor"/>
                        : null}
                </svg>
            </div>
        </div>
    );
};

export default UserCheckBox;