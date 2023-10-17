import React, {useContext, useEffect, useId, useState} from 'react';
import csx from "classnames";
import styles from "./InfoColumn.module.scss";
import UserInfo from "../UserInfo/UserInfo";
import {UserDetails} from "../../../models/UserDetails";
import {PrivateChatViewModel, UserProfileViewModel} from "../../../models/PrivateChatViewModel";
import List from "../List/List";
import UserListElement from "../List/UserListElement";
import {ActionType} from "../reducer";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../../Contexts";
import PrivateChatLookUp from "../../../models/PrivateChatLookUp";
import UserInfoFromList from "./UserInfoFromList";
import IListElement from "../List/IListElement";
import {ContextOption} from "../ContextMenu/ContextOption";

const widthToHide = 900 //1130

type Props = {
    hidden: boolean
}
const InfoColumn = ({hidden}: Props) => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const [info, setInfo] = useState<UserDetails | PrivateChatViewModel>()
    const {chats, getData, dispatch, user} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    const chat = chats.find(c => c.id === selectedChatId) as PrivateChatLookUp;
    const [selectedUser, selectUser] = useState<string>();

    useEffect(() => {
        if (!chat) {
            setInfo(undefined);
            return;
        }
        if ("serverId" in chat) {
            // const server = servers.find(s => s.id === selectedServerId) as ServerDetailsDto | undefined;
            // if(server && server.serverProfiles)
            //     setInfo((prev) => {
            //
            //         server.serverProfiles?.sort((a, b) => {
            //             if (a.displayName < b.displayName)
            //                 return -1;
            //             if (a.displayName > b.displayName)
            //                 return 1;
            //             return 0;
            //         })
            //         return viewModel;
            //     });
        } else if (!("profiles" in chat)) {
            getData.privateChats
                .getDetails(selectedChatId as string)
                .then(c => {
                    console.log(c)
                    if ((c as PrivateChatViewModel).ownerId) {
                        dispatch({
                            type: ActionType.PrivateChatSaved,
                            value: {
                                ...c,
                                membersCount: c.profiles.length
                            }
                        })
                    } else {
                        getData.users
                            .getUser(c.profiles.filter(p => p.userId !== user.id)[0].userId)
                            .then(u => {
                                dispatch({
                                    type: ActionType.PrivateChatSaved,
                                    value: {
                                        ...c,
                                        image: u.avatar,
                                        userDetails: u,
                                        userStatus: u.status,
                                        userTextStatus: u.textStatus
                                    }
                                })
                            });
                    }
                })
        } else if ("userDetails" in chat)
            setInfo(chat.userDetails as UserDetails);
        else
            setInfo((prev) => {
                const viewModel = {...chat as PrivateChatViewModel};
                viewModel.profiles.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                })
                return viewModel;
            });

    }, [chats, dispatch, getData.privateChats, getData.users, selectedChatId, user.id]);

    useEffect(() => {
        const updatePageWidth = () => {
            setHideInfo(window.innerWidth < widthToHide)
        };
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);

        return () => {
            window.removeEventListener('resize', updatePageWidth);
        };
    }, [])

    function getListElement(profile: UserProfileViewModel): UserListElement {
        const le = new UserListElement({
            id: profile.id,
            displayName: profile.name,
            avatar: profile.avatarUrl,
            textStatus: profile.textStatus,
            status: profile.status
        })
        le.clickAction = () => {
            selectUser(profile.userId);
        }
        return le;
    }

    function removeMember(id: string) {
        getData.privateChats.removeGroupChatMember(chat.id, {profileId: id});
    }

    function makeOwner(id: string) {
        getData.privateChats.changeGroupChatOwner(chat.id, id);
    }

    function setContextAction(e: IListElement) {
        const options: (ContextOption | null)[] = [null];
        const viewModel = info as PrivateChatViewModel;
        const curUserProfile = viewModel.profiles.find(p => p.userId === user.id);
        if (e.id === curUserProfile?.id) {
            options.push(
                {
                    title: "Leave from chat",
                    action: () => getData.privateChats.leaveFromGroupChat(chat.id), danger: true
                }
            )
        } else if (viewModel.ownerId === curUserProfile?.id) //&& viewModel.profiles.
            options.push(
                {
                    title: "Remove Member",
                    action: () => removeMember(e.id), danger: true
                },
                {title: "Make Owner", action: () => makeOwner(e.id), danger: true}
            )
        return options;
    }

    return selectedChatId ?
        <div className={csx(styles.infoColumn, {[styles.hide]: hidden || hideInfo})}>
            {info ?
                "avatar" in info ?
                    <UserInfo userDetails={info as UserDetails}/> :
                    <List elements={(info as PrivateChatViewModel).profiles.map(p => getListElement(p))}
                          setContextAction={setContextAction}>
                        {
                            (e, ref) => {
                                return (
                                    <UserInfoFromList
                                        listElement={e as UserListElement}
                                        serverId={selectedServerId}
                                        selectedUser={selectedUser}
                                        selectUser={selectUser}
                                        containerRef={ref}
                                    />
                                )
                            }
                        }
                    </List>
                : null}
        </div>
        : null;
};

export default InfoColumn;