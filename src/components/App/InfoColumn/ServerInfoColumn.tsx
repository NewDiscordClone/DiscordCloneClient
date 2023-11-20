import React, {useContext, useEffect, useState} from 'react';
import {AppContext, SelectedServerContext} from "../../../Contexts";
import {ServerProfileLookup} from "../../../models/ServerProfileLookup";
import ServerLookUp from "../../../models/ServerLookUp";
import {ActionType} from "../reducer";
import List from "../List/List";
import UserInfoFromList from "./UserInfoFromList";
import UserListElement from "../List/UserListElement";
import ServerDetailsDto from "../../../models/ServerDetailsDto";
import IListElement from "../List/IListElement";
import {ContextOption} from "../ContextMenu/ContextOption";
import Modal from "../Modal/Modal";
import SetRolesModal from "./SetRolesModal/SetRolesModal";

const ServerInfoColumn = () => {
    const {getData, servers, profiles, dispatch, users} = useContext(AppContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    if (!selectedServerId) throw new Error("selectedServerId is can't be undefined at this point");
    const server = servers[selectedServerId] as unknown as ServerDetailsDto;
    const [selectedUser, selectUser] = useState<string>();
    const [userToSetRoles, setUserToSetRoles] = useState<string>();

    useEffect(() => {
        if (!selectedServerId || !server) return;
        if (!("serverProfiles" in server)) return;
        if (profiles[server.serverProfiles[0]]) return;

        // console.log("save profiles")
        getData.serverProfiles
            .getServerProfiles(selectedServerId)
            .then(ps =>
                dispatch({
                    type: ActionType.ServerProfilesSaved,
                    value: ps
                })
            )

    }, [dispatch, getData.serverProfiles, profiles, selectedServerId, server])

    const profilesToShow = !profiles[server.serverProfiles[0]]? undefined : server.serverProfiles
        .map(id => profiles[id])
        .sort((a, b) => {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });

    function getListElement(profile: ServerProfileLookup): UserListElement {
        // const le = new UserListElement(profile.userId, users, profile.id)
        const le = new UserListElement(profile.userId, users, profile.id, profiles)
        le.clickAction = () => {
            selectUser(profile.userId);
        }
        return le;
    }

    function setContextAction(e: IListElement) {
        const options: (ContextOption | null)[] = [];
        const profile = e as UserListElement;
        options.push(
            {
                title: "Change roles",
                action: () => {
                    setUserToSetRoles(profile.profileId)
                }
            },
            {
                title: "Kick member",
                action: () => {
                    getData.serverProfiles.kickUser(selectedServerId as string, profile.profileId as string)
                },
                danger: true
            },
            {
                title: "Ban member",
                action: () => {
                    getData.serverProfiles.banUser(selectedServerId as string, profile.profileId as string)
                },
                danger: true
            }
        )
        return options;
    }

    // console.log(profilesToShow)
    return (
        <>
            {profilesToShow &&
				<List elements={profilesToShow.map(p => getListElement(p))}
					  setContextAction={setContextAction}>
                    {
                        (e, ref) => {
                            return (
                                <UserInfoFromList
                                    listElement={e as UserListElement}
                                    serverId={server.id}
                                    selectedUser={selectedUser}
                                    selectUser={selectUser}
                                    containerRef={ref}
                                />
                            )
                        }
                    }
				</List>
            }
            <Modal isOpen={!!userToSetRoles} setOpen={() => setUserToSetRoles(undefined)}>
                <SetRolesModal serverId={selectedServerId} profileId={userToSetRoles as string}/>
            </Modal>
        </>
    );
};

export default ServerInfoColumn;