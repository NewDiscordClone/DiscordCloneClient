import React, {useContext, useState} from 'react';
import {InvitationDetails} from "../../../../../../models/InvitationDetails";
import {AppContext, SelectedServerContext} from "../../../../../../Contexts";
import styles from "./InvitationView.module.scss"
import MessageViewModel from "../MessageViewModel";
import ServerDetailsDto from "../../../../../../models/ServerDetailsDto";
import {ActionType} from "../../../../reducer";

type Props = {
    invitation: InvitationDetails | null
    message: MessageViewModel;
}
const InvitationView = ({invitation, message}: Props) => {
    const {getData, user, users, servers, dispatch} = useContext(AppContext);
    const {selectServer} = useContext(SelectedServerContext);

    function handleButton() {
        if (!invitation) return;
        if (servers[invitation.server.id as string]) {
            selectServer(invitation.server.id);
        } else {
            getData.servers.joinServer(invitation.id as string)
                .then(() => getData.servers.getServerDetails(invitation.server.id as string))
                .then((server: ServerDetailsDto) => {
                    dispatch({
                        type: ActionType.ServerDetails,
                        value: server
                    })
                    selectServer(server.id);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    if (invitation === null)
        return (
            <div className={styles.invitation}>
                <p>{user.id === message.userId ? "You sent an invite, but..." : "You've been invited, but..."}</p>
                <div className={styles.row}>
                    <div className={styles.iconContainer}>
                        <img src={"icons/invitationOutdated.svg"} alt={"invitation outdated"}/>
                    </div>
                    <div style={{marginLeft: "10px"}}>
                        <h2 className={styles.invalidText}>Invalid invite</h2>
                        <span>Try sending a new invite!</span>
                    </div>
                </div>
            </div>
        )
    return (
        <div className={styles.invitation}>
            <p>{user.id === message.userId ? "You sent an invite, to join a server" : "You've been invited, to join a server"}</p>
            <div className={styles.row}>
                <div className={styles.iconContainer}>
                    {invitation.server.image?
						<img src={invitation.server.image} alt={"server icon"}/> :
                        <div className={styles.textContainer}>
                            <h1>{invitation.server.title?.slice(0, 2)}</h1>
                        </div>
                    }
                </div>
                <div className={styles.info}>
                    <h2>{invitation.server?.title}</h2>
                    {invitation.user &&
						<span>from {users[invitation.user.id].displayName ?? invitation.user.displayName}</span>
                    }
                </div>
                <div className={styles.button} onClick={handleButton}>
                    {servers[invitation.server.id as string] ? "Joined" : "Join"}
                </div>
            </div>
        </div>
    );
};

export default InvitationView;