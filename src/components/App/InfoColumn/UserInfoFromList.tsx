import React, {MutableRefObject, useContext, useEffect} from 'react';
import UserListElement from "../List/UserListElement";
import {UserDetails} from "../../../models/UserDetails";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import UserInfo from "../UserInfo/UserInfo";
import styles from "./InfoColumn.module.scss"
import {PrivateChatViewModel} from "../../../models/PrivateChatViewModel";
import {ActionType} from "../reducer";
import PersonalChatLookupImpl from "../../../models/PersonalChatLookupImpl";
import {PersonalChatLookUp} from "../../../models/PrivateChatLookUp";
import {RelationshipType} from "../../../models/Relationship";

type Props = {
    listElement: UserListElement
    serverId: string | undefined
    selectedUser: string | undefined
    selectUser: (user: string | undefined) => void;
    containerRef: MutableRefObject<HTMLLIElement | undefined>
}
const UserInfoFromList = ({listElement, serverId, selectedUser, selectUser, containerRef}: Props) => {
    const {getData, chats, dispatch, users, user, relationships} = useContext(AppContext);
    const {selectChat} = useContext(SelectedChatContext);
    const userDetails: UserDetails | undefined =
        "username" in users[listElement.id] ?
            users[listElement.id] as UserDetails : undefined;
    if (userDetails && serverId) {
        userDetails.serverProfile = listElement.profile;
    }

    useEffect(() => {
        if (selectedUser === listElement.id) {
            if (!userDetails) {
                console.log("getUser")
                if (!users[selectedUser] || !("username" in users[selectedUser]))
                    getData.users
                        .getUser(listElement.id, serverId)
                        .then(u => dispatch({type: ActionType.UpdateUser, value: u}));
            }
            if (serverId && (!userDetails || !userDetails.serverProfile || !userDetails.serverProfile.roles)) {
                console.log("getProfile")
                getData.serverProfiles
                    .getServerProfile(listElement.profileId as string, serverId)
                    .then(p => dispatch({type: ActionType.ServerProfileSaved, value: {...p, serverId}}));
            }
        }

    }, [getData.users, listElement.id, selectedUser, serverId, userDetails])
    useEffect(() => {
        function onClick(event: any) {
            if (containerRef.current &&
                !containerRef.current.contains(event.target) &&
                selectedUser === listElement.id) {

                selectUser(undefined);
            }
        }

        window.addEventListener("click", onClick)
        return () => {
            window.removeEventListener("click", onClick)
        }
    }, [containerRef, listElement.id, selectUser, selectedUser])

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const text = e.currentTarget.value
        if (!userDetails || !text) return;

        function sendMessage(chat: PrivateChatViewModel, text: string) {
            if (!chats[chat.id]) {
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: new PersonalChatLookupImpl(chat as unknown as PersonalChatLookUp, users)
                });
            }

            selectChat(chat.id);
            getData.messages.addMessage(chat.id, {text, attachments: []})
        }

        if (e.key === "Enter") {
            getData.privateChats
                .getPersonalChat(userDetails.id)
                .then(chat => sendMessage(chat, text))
                .catch(() =>
                    getData.privateChats
                        .createChat([userDetails.id])
                        .then(chatId => getData.privateChats.getDetails(chatId))
                        .then(chat => sendMessage(chat, text))
                )
        }
    }

    const relationship = relationships.find(u => u.user.id === userDetails?.id);
    const isBlocked = relationship && relationship.type === RelationshipType.Blocked;

    if (!userDetails || selectedUser !== listElement.id) return <></>
    return (
        <div className={styles.infoContainer}>
            <UserInfo userDetails={userDetails}>
                {userDetails.id !== user.id &&
                isBlocked ?
                    <input placeholder={!relationship.isActive ?
                        "You have blocked this person" :
                        "You have been blocked by this person"}
                           disabled/>
                    :
                    <input placeholder={"Message @" + (userDetails.username)} onKeyDown={onKeyDown}/>
                }
            </UserInfo>
        </div>
    );
};

export default UserInfoFromList;