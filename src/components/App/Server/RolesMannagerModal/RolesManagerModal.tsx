import React, {useContext, useEffect, useState} from 'react';
import ServerDetailsDto from "../../../../models/ServerDetailsDto";
import RolesColumn from "./RolesColumn";
import {AppContext} from "../../../../Contexts";
import {ActionType} from "../../reducer";
import {Role} from "../../../../models/Role";
import styles from "./RolesManagerModal.module.scss"
import RoleSettings from "./RoleSettings";


type Props = {
    server: ServerDetailsDto;
}
const RolesManagerModal = ({server}: Props) => {
    const {getData, dispatch} = useContext(AppContext);
    const [selectedRole, selectRole] = useState<Role>();
    useEffect(() => {
        if ("roles" in server) return;
        getData.roles
            .getRoles(server.id)
            .then(roles =>
                dispatch({type: ActionType.SaveRoles, value: {id: server.id, roles}}));
    }, [server])
    useEffect(() => {
        if(!selectedRole || selectedRole.claims) return;
        getData.roles.getRole(selectedRole.id, server.id)
            .then(role =>
                dispatch({type: ActionType.SaveRole, value: {serverId: server.id, role}}))
    }, [selectedRole])

    if (!("roles" in server)) return <></>
    return (
        <div className={styles.container}>
            <RolesColumn
                roles={server.roles as Role[]}
                selectRole={selectRole}
                selectedRole={selectedRole?.id}
                serverId={server.id}
            />
            <RoleSettings role={selectedRole} serverId={server.id}/>
        </div>
    );
};

export default RolesManagerModal;