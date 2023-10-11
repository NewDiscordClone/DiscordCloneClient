import React, {useContext, useEffect, useState} from 'react';
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

const widthToHide = 900 //1130

const InfoColumn = () => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const [info, setInfo] = useState<UserDetails | UserProfileViewModel[]>()
    const {chats, getData, dispatch, user} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    const chat = chats.find(c => c.id === selectedChatId) as PrivateChatLookUp;
    const viewModel = chat as PrivateChatViewModel;
    const [selectedUser, selectUser] = useState<string>();

    useEffect(() => {
        if (!chat) {
            setInfo(undefined);
            return;
        }
        if (!("profiles" in chat)) {
            getData.privateChats
                .getDetails(selectedChatId as string)
                .then(c => {
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
                const profiles = [...chat.profiles as UserProfileViewModel[]];
                profiles.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                })
                return profiles;
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
            id: profile.userId,
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

    return selectedChatId ?
        <div className={csx(styles.infoColumn, {[styles.hide]: hideInfo})}>
            {info ?
                "id" in info ?
                    <UserInfo userDetails={info}/> :
                    <List elements={info.map(p => getListElement(p))}>
                        {
                            (e, ref) =>
                                <UserInfoFromList
                                    listElement={e as UserListElement}
                                    serverId={selectedServerId}
                                    selectedUser={selectedUser}
                                    selectUser={selectUser}
                                    containerRef={ref}
                                />

                        }
                    </List>
                : null}
        </div>
        : null;
};

export default InfoColumn;