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
    const [selectedRoleId, selectRole] = useState<string>();
    const selectedRole = server.roles?.find(r => r.id === selectedRoleId);
    useEffect(() => {
        if (!selectedRole)
            selectRole(undefined);
    }, [selectedRole])
    useEffect(() => {
        if (server.roles && typeof server.roles[0] !== "string") return;
        getData.roles
            .getRoles(server.id)
            .then(roles =>
                dispatch({type: ActionType.SaveRoles, value: {id: server.id, roles}}));
    }, [server])
    useEffect(() => {
        if (!selectedRole || !selectedRole.id || selectedRole.claims) return;
        getData.roles.getRole(selectedRole.id, server.id)
            .then(role =>
                dispatch({type: ActionType.SaveRole, value: {...role, serverId: server.id}}))
    }, [selectedRole])

    if (!server.roles) return <></>
    return (
        <div className={styles.container}>
            <RolesColumn
                roles={server.roles as Role[]}
                selectRole={selectRole}
                selectedRole={selectedRole?.id}
                server={server}
            />
            <RoleSettings role={selectedRole as Role} serverId={server.id}/>
        </div>
    );
};

export default RolesManagerModal;