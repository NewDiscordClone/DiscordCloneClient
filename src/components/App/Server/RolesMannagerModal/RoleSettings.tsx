import React, {useContext} from 'react';
import styles from "./RolesManagerModal.module.scss"
import TopPanel from "../../SettingsModal/TopPanel";
import SettingsModal from "../../SettingsModal/SettingsModal";
import {Role} from "../../../../models/Role";
import BlockSection from "../../SettingsModal/BlockSection";
import InputSection from "../../SettingsModal/InputSection";
import {AppContext} from "../../../../Contexts";
import ClaimView from "./ClaimView";

type Props = {
    role: Role | undefined;
    serverId: string;
}
const RoleSettings = ({role, serverId}: Props) => {
    const {getData} = useContext(AppContext);

    function changeName(name: string) {
        if (!role || !name || name === role?.name) return;
        getData.roles.updateRoleName(role.id, name, serverId);
    }

    function changeColor(color: string) {
        console.log(color);
        if (!role || !color || color === role?.color) return;
        getData.roles.updateRoleColor(role.id, color, serverId);
    }

    function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    }

    return (
        <SettingsModal className={styles.modalWindow}>
            <TopPanel title={role?.name || "Role"}/>
            {role &&
				<>
					<BlockSection>
						<InputSection title={"Role name"}>
							<input type={"text"}
								   placeholder={role.name}
								   defaultValue={role.name}
								   maxLength={100}
								   onBlur={e => changeName(e.target.value)}
								   onKeyDown={onKey}/>
						</InputSection>
						<InputSection title={"Role color"}>
							<input type={"color"}
								   placeholder={role.color}
								   defaultValue={role.color}
								   maxLength={100}
								   onBlur={e => changeColor(e.target.value)}
								   onKeyDown={onKey}/>
						</InputSection>
					</BlockSection>
					<BlockSection className={styles.permissionsContainer}>
						<div className={styles.permissions}>
							<h2>general permissions</h2>
							<ClaimView
								title={"Manage channels"}
								description={"Allows members to create, edit and remove"}
								type={"ManageChannels"}
								value={role.claims?.find(c => c.type === "ManageChannels")?.value ?? undefined}/>
							<ClaimView
								title={"Manage roles"}
								description={"Allows members to create, edit and remove"}
								type={"ManageRoles"}
								value={role.claims?.find(c => c.type === "ManageRoles")?.value ?? undefined}/>
							<ClaimView
								title={"Manage Server"}
								description={"Allows members to change server name and image"}
								type={"ManageServer"}
								value={role.claims?.find(c => c.type === "ManageServer")?.value ?? undefined}/>
							<ClaimView
								title={"Change own display name"}
								description={"Allows members to change their own display name"}
								type={"ChangeServerName"}
								value={role.claims?.find(c => c.type === "ChangeServerName")?.value ?? undefined}/>
							<ClaimView
								title={"Change other's display name"}
								description={"Allows members to change other's display name"}
								type={"ChangeSomeoneServerName"}
								value={role.claims?.find(c => c.type === "ChangeSomeoneServerName")?.value ?? undefined}/>
							<ClaimView
								title={"Delete messages"}
								description={"Allows members to delete messages"}
								type={"RemoveMessages"}
								value={role.claims?.find(c => c.type === "RemoveMessages")?.value ?? undefined}/>
							<ClaimView
								title={"Remove reactions"}
								description={"Allows members to remove reactions from messages"}
								type={"RemoveMessageReactions"}
								value={role.claims?.find(c => c.type === "RemoveMessageReactions")?.value ?? undefined}/>
							<ClaimView
								title={"Create Invitations"}
								description={"Allows members to invite other members to the server"}
								type={"CreateInvitation"}
								value={role.claims?.find(c => c.type === "CreateInvitation")?.value ?? undefined}/>
							<ClaimView
								title={"Ban Users"}
								description={"Allows members to ban users from the server"}
								type={"BanUsers"}
								value={role.claims?.find(c => c.type === "BanUsers")?.value ?? undefined}/>
							<ClaimView
								title={"Kick Users"}
								description={"Allows members to kick users from the server"}
								type={"KickUsers"}
								value={role.claims?.find(c => c.type === "KickUsers")?.value ?? undefined}/>
						</div>
					</BlockSection>
				</>
            }
        </SettingsModal>
    );
};

export default RoleSettings;