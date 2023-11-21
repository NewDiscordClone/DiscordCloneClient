import React from 'react';
import styles from "./RolesManagerModal.module.scss"
import {Role} from "../../../../models/Role";
import csx from "classnames";

type Props = {
    role: Role;
    selectRole: (roleId: string) => void;
    isSelected: boolean;
}
const RoleItem = ({role, selectRole, isSelected} : Props) => {
    return (
        <div className={csx(styles.role, {[styles.selected]: isSelected})}
             onClick={() => !isSelected && selectRole(role.id)}>
            <div className={styles.dot} style={{background: role.color}}/>
            <span>{role.name}</span>
        </div>
    );
};

export default RoleItem;