import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../../Contexts";
import {ServerProfileDetails} from "../../../../models/ServerProfileDetails";
import ServerDetailsDto from "../../../../models/ServerDetailsDto";
import {Role} from "../../../../models/Role";
import {ActionType} from "../../reducer";
import SettingsModal from "../../SettingsModal/SettingsModal";
import TopPanel from "../../SettingsModal/TopPanel";
import BlockSection from "../../SettingsModal/BlockSection";
import RoleCheckBox from "./RoleCheckBox";
import styles from "./SetRolesModal.module.scss";
import {ModalContext} from "../../Modal/Modal";

type Props = {
    serverId: string;
    profileId: string;
}
const SetRolesModal = ({serverId, profileId}: Props) => {
    const {getData, servers, dispatch, media} = useContext(AppContext);
    const {beforeClose} = useContext(ModalContext);
    const server = servers[serverId] as unknown as ServerDetailsDto;
    const [profile, setProfile] = useState<ServerProfileDetails>();
    const [roles, setRoles] = useState<Role[]>();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    useEffect(() => {
        function saveRoles(){
            console.log("saveRoles");
            getData.serverProfiles.changeServerProfileRoles(profileId, serverId, {roles: selectedRoles})
        }
        beforeClose.addListener(saveRoles)
        return () => beforeClose.removeListener(saveRoles);

    }, [beforeClose, selectedRoles])

    useEffect(() => {
        setSelectedRoles([]);
        setProfile(undefined);
        getData.serverProfiles.getServerProfile(profileId, serverId)
            .then(p => {
                setProfile(p);
                setSelectedRoles(p.roles.map(r => r.id));
            })
            .then(() => server.roles ?? getData.roles.getRoles(serverId).then(roles => {
                    dispatch({type: ActionType.SaveRoles, value: {id: serverId, roles}})
                    return roles;
                })
            )
            .then(roles => setRoles(roles))
    }, [serverId, profileId])

    function selectRole(role: Role) {
        setSelectedRoles(prev => {
            const updated = [...prev];
            updated.push(role.id);
            return updated;
        })
    }

    function unselectRole(roleId: string) {
        setSelectedRoles(prev => {
            const updated = [...prev];
            const index = updated.findIndex(r => r === roleId);
            if (index > -1)
                updated.splice(index, 1);
            return updated;
        })
    }

    return (
        <SettingsModal>
            <TopPanel title={profile ? profile.name + "'s Roles" : "Modify Roles"}
                      icon={(profile && profile.avatarUrl && media[profile.avatarUrl]) ?? undefined}/>
            {roles &&
				<BlockSection className={styles.rolesContainer}>
                    {roles.length > 0 ?
                        [...roles].sort((a, b) => b.priority - a.priority).map(r =>
                            <RoleCheckBox
                                key={r.id}
                                role={r}
                                isSelected={selectedRoles.find(sr => sr === r.id) !== undefined}
                                setSelect={(value) => value ? selectRole(r) : unselectRole(r.id)}
                            />
                        ) :
                        <div className={styles.textContainer}>
                            <h3>You don't have available roles</h3>
                        </div>
                    }
				</BlockSection>
            }
        </SettingsModal>
    );
};

export default SetRolesModal;