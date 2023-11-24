import React, {useContext} from 'react';
import styles from "./RolesManagerModal.module.scss"
import {Role} from "../../../../models/Role";
import SettingsModal from "../../SettingsModal/SettingsModal";
import RoleItem from "./RoleItem";
import {AppContext} from "../../../../Contexts";
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import ServerDetailsDto from "../../../../models/ServerDetailsDto";
import {ActionType} from "../../reducer";

type Props = {
    roles: Role[]
    selectRole: (roleId: string) => void
    selectedRole: string | undefined
    server: ServerDetailsDto;
}
const RolesColumn = ({roles, selectRole, selectedRole, server}: Props) => {
    const {getData, dispatch} = useContext(AppContext);
    function handleCreateNewRole() {
        getData.roles.createRole(server.id, {name: "new role", color: "#A2A2A2", claims: []})
    }

    function handleDragEnd({destination, source, draggableId}: DropResult) {
        if (!destination ||
            (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
        ) return;
        let newRoles = [...roles];
        const role = newRoles.splice(source.index, 1)[0];
        const start = newRoles.slice(0, destination.index);
        const end = newRoles.slice(destination.index);

        newRoles = [...start, role, ...end];
        newRoles.reverse();
        newRoles.forEach((r, i) => r.priority = i+1);
        newRoles.reverse();

        const priorityDict : {[id: string]: number} = {}
        newRoles.forEach(r => priorityDict[r.id] = r.priority);

        getData.roles.updateRolePriorities(server.id, priorityDict);
        dispatch({type:ActionType.SaveRoles, value: {id: server.id, roles: newRoles}})
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <SettingsModal className={styles.roles}>
                <div className={styles.rolesTitle}>
                    <h3>Roles</h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onClick={handleCreateNewRole}>
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </div>
                <Droppable droppableId={"roles"}>
                    {(provided, snapshot) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {[...roles]
                                .sort((a, b) => b.priority - a.priority)
                                .map((r, i) => <RoleItem index={i} key={r.id} role={r}
                                                         selectRole={selectRole}
                                                         isSelected={r.id === selectedRole}/>)}
                            {provided.placeholder}
                        </div>
                    }
                </Droppable>
            </SettingsModal>
        </DragDropContext>
    );
};

export default RolesColumn;