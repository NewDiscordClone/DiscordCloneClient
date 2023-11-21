import React, {useContext, useEffect, useState} from 'react';
import styles from "./RolesManagerModal.module.scss"
import TopPanel from "../../SettingsModal/TopPanel";
import SettingsModal from "../../SettingsModal/SettingsModal";
import {Claim, Role} from "../../../../models/Role";
import BlockSection from "../../SettingsModal/BlockSection";
import InputSection from "../../SettingsModal/InputSection";
import {AppContext} from "../../../../Contexts";
import ClaimView from "./ClaimView";
import Button from "../../SettingsModal/Button";

type Props = {
    role: Role | undefined;
    serverId: string;
}
const RoleSettings = ({role, serverId}: Props) => {
    const {getData} = useContext(AppContext);
    const [name, setName] = useState<string>();
    const [color, setColor] = useState<string>();
    const [claims, setClaims] = useState<Claim[] | null>();

    useEffect(() => {
        if (role) {
            console.log(role);
            setName(role.name);
            setColor(role.color);
            setClaims(role.claims);
        }
    }, [role])

    function changeName() {
        if (!role || !name || name === role?.name) return;
        getData.roles.updateRoleName(role.id, name, serverId);
    }

    function changeColor() {
        if (!role || !color || color === role?.color) return;
        getData.roles.updateRoleColor(role.id, color, serverId);
    }

    function deleteRole() {
        if (!role) return;
        getData.roles.deleteRole(role.id, serverId);
    }

    function updateClaims() {
        console.log(claims);
        if (!role || !claims || JSON.stringify(role.claims) === JSON.stringify(claims)) return;
        getData.roles.updateRoleClaims(role.id, serverId, claims);
    }

    function setClaim(type: string, value: boolean | undefined) {
        setClaims(prev => {
            const updated: Claim[] = [...(prev ?? [])];
            const index = updated.findIndex(c => c.type === type);
            if (index > -1) {
                if (value !== undefined)
                    updated[index] = {type, value};
                else
                    updated.splice(index, 1);
            } else if (value !== undefined) {
                updated.push({type, value});
            }
            return updated;
        });
    }

    function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    }

    const claimsChanged = role && claims && JSON.stringify(role.claims) === JSON.stringify(claims);

    return (
        <SettingsModal className={styles.modalWindow}>
            <TopPanel title={role?.name || "Roles"}/>
            {role &&
				<>
					<BlockSection>
						<InputSection title={"Role name"}>
							<input type={"text"}
								   placeholder={role.name}
								   value={name}
								   onChange={e => setName(e.target.value)}
								   maxLength={100}
								   onBlur={changeName}
								   onKeyDown={onKey}/>
						</InputSection>
						<InputSection title={"Role color"}>
							<input type={"color"}
								   placeholder={role.color}
								   value={color}
								   onChange={e => setColor(e.target.value)}
								   maxLength={100}
								   onBlur={changeColor}
								   onKeyDown={onKey}/>
						</InputSection>
						<InputSection>
							<Button title={"Delete role"} danger onClick={deleteRole}/>
						</InputSection>
					</BlockSection>
					<BlockSection>
						<div className={styles.permissions}>
							<h2>general permissions</h2>
							<ClaimView
								title={"Manage channels"}
								description={"Allows members to create, edit and remove"}
								type={"ManageChannels"}
								value={claims?.find(c => c.type === "ManageChannels")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Manage Server"}
								description={"Allows members to change server name and image"}
								type={"ManageServer"}
								value={claims?.find(c => c.type === "ManageServer")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Change own display name"}
								description={"Allows members to change their own display name"}
								type={"ChangeServerName"}
								value={claims?.find(c => c.type === "ChangeServerName")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Change other's display name"}
								description={"Allows members to change other's display name"}
								type={"ChangeSomeoneServerName"}
								value={claims?.find(c => c.type === "ChangeSomeoneServerName")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Delete messages"}
								description={"Allows members to delete messages"}
								type={"RemoveMessages"}
								value={claims?.find(c => c.type === "RemoveMessages")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Remove reactions"}
								description={"Allows members to remove reactions from messages"}
								type={"RemoveMessageReactions"}
								value={claims?.find(c => c.type === "RemoveMessageReactions")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Create Invitations"}
								description={"Allows members to invite other members to the server"}
								type={"CreateInvitation"}
								value={claims?.find(c => c.type === "CreateInvitation")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Ban Users"}
								description={"Allows members to ban users from the server"}
								type={"BanUsers"}
								value={claims?.find(c => c.type === "BanUsers")?.value ?? undefined}
								setValue={setClaim}/>
							<ClaimView
								title={"Kick Users"}
								description={"Allows members to kick users from the server"}
								type={"KickUsers"}
								value={claims?.find(c => c.type === "KickUsers")?.value ?? undefined}
								setValue={setClaim}/>
						</div>
                        {!claimsChanged &&
							<InputSection>
								<Button title={"Save permissions"} onClick={updateClaims}/>
							</InputSection>
                        }
					</BlockSection>
				</>
            }
        </SettingsModal>
    );
};

export default RoleSettings;