import React, {useContext} from 'react';
import styles from "./RolesManagerModal.module.scss"
import {Role} from "../../../../models/Role";
import SettingsModal from "../../SettingsModal/SettingsModal";
import RoleItem from "./RoleItem";
import App from "../../App";
import {AppContext} from "../../../../Contexts";

type Props = {
    roles: Role[]
    selectRole: (role: Role) => void
    selectedRole: string | undefined
    serverId: string
}
const RolesColumn = ({roles, selectRole, selectedRole, serverId} : Props) => {
    const {getData} = useContext(AppContext);
    function handleCreateNewRole() {
        getData.roles.createRole(serverId, {name: "new role", color: "#A2A2A2", claims: []})
    }
    return (
        <SettingsModal className={styles.roles}>
            <div className={styles.rolesTitle}>
                <h3>Roles</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    onClick={handleCreateNewRole}>
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {roles.map(r => <RoleItem key={r.id} role={r} selectRole={selectRole} isSelected={r.id === selectedRole}/>)}
        </SettingsModal>
    );
};

export default RolesColumn;