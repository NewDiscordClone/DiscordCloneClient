import React from 'react';
import styles from "./RolesManagerModal.module.scss"
import {Role} from "../../../../models/Role";
import csx from "classnames";
import {Draggable} from "react-beautiful-dnd";

type Props = {
    role: Role;
    selectRole: (roleId: string) => void;
    isSelected: boolean;
    index: number;
}
const RoleItem = ({role, selectRole, isSelected, index}: Props) => {
    function handleClick() {
        console.log(role)
        if(!isSelected)
            selectRole(role.id)
    }
    return (
        <Draggable index={index} draggableId={role.id}>
            {(provided) =>
                <div {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     ref={provided.innerRef}
                     className={csx(styles.role, {[styles.selected]: isSelected})}
                     onClick={handleClick}>
                    <div className={styles.dot} style={{background: role.color}}/>
                    <span>{role.name}</span>
                </div>
            }
        </Draggable>
    );
};

export default RoleItem;