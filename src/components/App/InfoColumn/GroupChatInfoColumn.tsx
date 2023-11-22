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
    const {chats, getData, dispatch, user, users} = useContext(AppContext);
    const [viewModel, setViewModel] = useState<PrivateChatViewModel>();
    const {selectedChatId} = useContext(SelectedChatContext);
    if(!selectedChatId) throw new Error("selectedChatId is can't be undefined at this point");
    const chat = chats[selectedChatId] as unknown as PrivateChatViewModel;
    const [selectedUser, selectUser] = useState<string>();

    useEffect(() => {
        if (!chat.profiles) {
            getData.privateChats
                .getDetails(selectedChatId as string)
                .then(c => {
                    // console.log(c)
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
        const le = new UserListElement(profile.userId, users, profile.id);
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
                    action: () => {
                        getData.privateChats.leaveFromGroupChat(chat.id)
                    }, danger: true
                }
            )
        } else if (model.ownerId === curUserProfile?.id) //&& viewModel.profiles.
            options.push(
                {
                    title: "Remove Member",
                    action: () => removeMember(userLE.profileId as string), danger: true
                },
                {title: "Make Owner", action: () => makeOwner(userLE.profileId as string), danger: true}
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