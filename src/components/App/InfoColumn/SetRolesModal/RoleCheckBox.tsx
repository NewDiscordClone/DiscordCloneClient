import React from 'react';
import styles from "./SetRolesModal.module.scss";
import csx from "classnames";
import {Role} from "../../../../models/Role";

type Props = {
    role: Role;
    isSelected: boolean;
    setSelect: (value: boolean) => void;
}
const RoleCheckBox = ({role, isSelected, setSelect}: Props) => {
    return (
        <div className={styles.role} onClick={() => setSelect(!isSelected)}>
            <div className={styles.circle} style={{background: role.color}}/>
            <h3>{role.name}</h3>
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

export default RoleCheckBox;