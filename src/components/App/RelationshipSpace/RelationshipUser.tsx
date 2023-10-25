import React, {ReactElement, useContext} from 'react';
import styles from './RelationshipSpace.module.scss'
import {Relationship} from "../../../models/Relationship";
import csx from "classnames";
import {UserStatus} from "../../../models/UserDetails";
import {Tab} from "./RelationshipSpace";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import {ActionType} from "../reducer";
import {PrivateChatViewModel} from "../../../models/PrivateChatViewModel";

type Props = {
    relationship: Relationship;
    tab: Tab
}
const RelationshipUser = ({relationship, tab}: Props) => {
    const {getData, chats, dispatch, user} = useContext(AppContext);
    const {selectChat} = useContext(SelectedChatContext);

    function openChat() {
        function saveChat(chat: PrivateChatViewModel) {
            // const other = chat.profiles.filter(u => u.userId !== user.id)[0];
            // if (!chats.find(c => c.id === chat.id))
            //     dispatch({
            //         type: ActionType.PrivateChatSaved,
            //         value: {...chat,
            //             userStatus: other.status,
            //             userTextStatus: other.textStatus}
            //     });

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
        //TODO showProfile Modal
        // alert("not implemented yet");
        openChat();
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

    function removeFromBlock() {
        //TODO removeFromBlock
        alert("not implemented yet");
    }

    let buttons: ReactElement;
    switch (tab) {
        case Tab.Online:
        case Tab.All:
            buttons = (
                <>
                    <div className={styles.button} onClick={openChat}>
                        <img src={"icons/sendMessage.svg"} alt={"sendMessage"}/>
                    </div>
                    <div className={styles.button}>
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
                <div className={styles.button} onClick={removeFromBlock}>
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
        <li className={styles.item}>
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