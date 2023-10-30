import React, {useContext, useEffect, useState} from 'react';
import {AppContext, SelectedServerContext} from "../../../Contexts";
import {ServerProfileLookup} from "../../../models/ServerProfileLookup";
import ServerLookUp from "../../../models/ServerLookUp";
import {ActionType} from "../reducer";
import List from "../List/List";
import UserInfoFromList from "./UserInfoFromList";
import UserListElement from "../List/UserListElement";

const ServerInfoColumn = () => {
    const {getData, servers, dispatch} = useContext(AppContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    const server = servers.find(s => s.id === selectedServerId) as unknown as ServerLookUp & {profiles: ServerProfileLookup[] | undefined};
    const [profiles, setProfiles] = useState<ServerProfileLookup[]>();
    const [selectedUser, selectUser] = useState<string>();

    useEffect(() => {
        if(!selectedServerId || !server) return;
        if(!server.profiles) {
            getData.serverProfiles
                .getServerProfiles(selectedServerId)
                .then(ps =>
                    dispatch({
                        type: ActionType.ServerSaved,
                        value: {...server, profiles: ps}
                    })
                )
        }
        else {
            setProfiles((prev) => {
                const newProfiles = [...server.profiles as ServerProfileLookup[]];
                newProfiles.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                })
                return newProfiles;
            })
        }
    }, [dispatch, getData.serverProfiles, selectedServerId, server])

    function getListElement(profile: ServerProfileLookup): UserListElement {
        const le = new UserListElement({
            id: profile.userId,
            displayName: profile.name,
            avatar: profile.avatarUrl,
            textStatus: profile.textStatus,
            status: profile.status
        }, profile.id)
        le.clickAction = () => {
            selectUser(profile.userId);
        }
        return le;
    }

    return (
        <>
            {profiles &&
				<List elements={profiles.map(p => getListElement(p))}>
                    {
                        (e, ref) => {
                            return (
                                <UserInfoFromList
                                    listElement={e as UserListElement}
                                    serverId={undefined}
                                    selectedUser={selectedUser}
                                    selectUser={selectUser}
                                    containerRef={ref}
                                />
                            )
                        }
                    }
				</List>
            }
        </>
    );
};

export default ServerInfoColumn;