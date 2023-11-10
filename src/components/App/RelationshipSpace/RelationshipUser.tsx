import React, {ReactElement, useContext, useId, useRef, useState} from 'react';
import styles from './RelationshipSpace.module.scss'
import {Relationship} from "../../../models/Relationship";
import csx from "classnames";
import {UserDetails, UserStatus} from "../../../models/UserDetails";
import {Tab} from "./RelationshipSpace";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import {ActionType} from "../reducer";
import {PrivateChatViewModel} from "../../../models/PrivateChatViewModel";
import PersonalChatLookupImpl from "../../../models/PersonalChatLookupImpl";
import {PersonalChatLookUp} from "../../../models/PrivateChatLookUp";
import {useContextMenu} from "../ContextMenu/ContextMenuProvider";
import {ContextOption} from "../ContextMenu/ContextOption";
import ContextMenu from "../ContextMenu/ContextMenu";
import Modal from "../Modal/Modal";
import UserInfo from "../UserInfo/UserInfo";
import UserDetailsImpl from "../../../models/UserDetailsImpl";

type Props = {
    relationship: Relationship;
    tab: Tab
}
const RelationshipUser = ({relationship, tab}: Props) => {
    const {getData, chats, dispatch, users} = useContext(AppContext);
    const {selectChat} = useContext(SelectedChatContext);
    const [isContextMenu, setContextMenu] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserDetails>();
    const id = useId();
    const buttonRef = useRef<HTMLDivElement>();

    function openChat() {
        function saveChat(chat: PrivateChatViewModel) {
            if (!chats[chat.id]) {
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: new PersonalChatLookupImpl(chat as unknown as PersonalChatLookUp, users)
                });
            }

            selectChat(chat.id);
        }

        getData.privateChats
            .getPersonalChat(relationship.user.id)
            .then(saveChat)
            .catch(() =>
                getData.privateChats
                    .createChat([relationship.user.id])
                    .then(chatId => getData.privateChats.getDetails(chatId))
                    .then(saveChat)
            )
    }

    function showProfile() {
        const user = users[relationship.user.id];
        if(user instanceof UserDetailsImpl){
            setProfile(user as UserDetails);
        }
        else {
            getData.users.getUser(relationship.user.id)
                .then(details => setProfile(details));
        }
    }

    function itemClick() {
        switch (tab) {
            case Tab.Online:
            case Tab.All:
                openChat();
                break;
            case Tab.Pending:
            case Tab.Blocked:
                showProfile();
                break;
            default:
                break;
        }
    }


    function acceptFriend() {
        getData.users.acceptFriendRequest(relationship.user.id);
    }

    function rejectFriend() {
        getData.users.cancelFriendRequest(relationship.user.id);
    }

    function removeFriend() {
        getData.users.deleteFriend(relationship.user.id);
    }

    function block() {
        getData.users.blockUser(relationship.user.id);
    }

    function unblock() {
        getData.users.unblockUser(relationship.user.id);
    }

    const options: (ContextOption | null)[] = [
        {
            title: "Profile",
            action: showProfile,
        },
        {
            title: "Message",
            action: tab === Tab.Blocked ? () => {
            } : openChat,
            disabled: tab === Tab.Blocked
        },
        null
    ]
    if (tab === Tab.All || tab === Tab.Online)
        options.push({
            title: "Remove friend",
            action: removeFriend,
            danger: true
        })

    if (tab === Tab.Blocked)
        options.push({
            title: "Unblock",
            action: unblock,
        })

    else
        options.push({
            title: "Block",
            action: block,
            danger: true
        })


    useContextMenu({
        id,
        options
    })

    let buttons: ReactElement;
    switch (tab) {
        case Tab.Online:
        case Tab.All:
            buttons = (
                <>
                    <div className={styles.button} onClick={openChat}>
                        <img src={"icons/sendMessage.svg"} alt={"sendMessage"}/>
                    </div>
                    <div className={styles.button} onClick={() => setContextMenu(true)} ref={buttonRef as any}>
                        {isContextMenu &&
							<ContextMenu options={options} outerRef={buttonRef}
										 closeMenu={() => setContextMenu(false)}/>
                        }
                        <img src={"icons/more.svg"} alt={"more"}/>
                    </div>
                </>
            )
            break;
        case Tab.Pending:
            buttons = (
                <>
                    {relationship.isActive ?
                        <div className={styles.button} onClick={acceptFriend}>
                            <img src={"icons/accept.svg"} alt={"accept"}/>
                        </div>
                        : null
                    }
                    <div className={styles.button} onClick={rejectFriend}>
                        <img src={"icons/reject.svg"} alt={"reject"}/>
                    </div>
                </>
            )
            break;
        case Tab.Blocked:
            buttons = (
                <div className={styles.button} onClick={unblock}>
                    <img src={"icons/reject.svg"} alt={"remove from block"}/>
                </div>
            )
            break;
        default:
            return <></>; //Cant be shown
    }

    let textStatus = relationship.user.textStatus
    if (!textStatus)
        switch (relationship.user.status) {
            case UserStatus.Online:
                textStatus = "ONLINE"
                break;
            case UserStatus.Idle:
                textStatus = "IDLE"
                break;
            case UserStatus.DoNotDisturb:
                textStatus = "DO NOT DISTURB"
                break;
            case UserStatus.Offline:
                textStatus = "OFFLINE"
                break;
            default:
                break;
        }


    return (
        <li className={styles.item} id={id}>
            <Modal isOpen={!!profile} setOpen={() => setProfile(undefined)}>
                {profile &&
					<UserInfo className={styles.userInfo} userDetails={profile}/>
                }
            </Modal>
            <div className={styles.innerContainer} onClick={itemClick}>
                <div className={styles.iconContainer}>
                    <img src={relationship.user.avatar} alt={"UserImage"}/>
                </div>
                <div className={csx(styles.content)}>
                    <strong>{relationship.user.displayName}</strong>
                    <div>
                        <span>{textStatus}</span>
                    </div>
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                {buttons}
            </div>
        </li>
    );
};

export default RelationshipUser;