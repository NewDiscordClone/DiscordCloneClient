import React, {useContext, useEffect, useState} from 'react';
import {PrivateChatViewModel, UserProfileViewModel} from "../../../models/PrivateChatViewModel";
import UserListElement from "../List/UserListElement";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import {ActionType} from "../reducer";
import IListElement from "../List/IListElement";
import {ContextOption} from "../ContextMenu/ContextOption";
import UserInfoFromList from "./UserInfoFromList";
import List from "../List/List";

const GroupChatInfoColumn = () => {
    const {chats, getData, dispatch, user} = useContext(AppContext);
    const [viewModel, setViewModel] = useState<PrivateChatViewModel>();
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = chats.find(c => c.id === selectedChatId) as unknown as PrivateChatViewModel;
    const [selectedUser, selectUser] = useState<string>();

    useEffect(() => {
        if (!chat.profiles) {
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
                    }
                });
        } else {
            setViewModel((prev) => {
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
        }
    }, [chat.profiles, dispatch, getData.privateChats, selectedChatId])

    function getListElement(profile: UserProfileViewModel): UserListElement {
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

    function removeMember(id: string) {
        getData.privateChats.removeGroupChatMember(chat.id, {profileId: id});
    }

    function makeOwner(id: string) {
        getData.privateChats.changeGroupChatOwner(chat.id, id);
    }

    function setContextAction(e: IListElement) {
        const options: (ContextOption | null)[] = [null];
        const model = viewModel as PrivateChatViewModel;
        const userLE = e as UserListElement;
        const curUserProfile = model.profiles.find(p => p.userId === user.id);
        if (userLE.profileId === curUserProfile?.id) {
            options.push(
                {
                    title: "Leave from chat",
                    action: () => getData.privateChats.leaveFromGroupChat(chat.id), danger: true
                }
            )
        } else if (model.ownerId === curUserProfile?.id) //&& viewModel.profiles.
            options.push(
                {
                    title: "Remove Member",
                    action: () => removeMember(e.id), danger: true
                },
                {title: "Make Owner", action: () => makeOwner(e.id), danger: true}
            )
        return options;
    }

    return (
        <>
            {viewModel &&
				<List elements={viewModel.profiles.map(p => getListElement(p))}
					  setContextAction={setContextAction}>
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

export default GroupChatInfoColumn;