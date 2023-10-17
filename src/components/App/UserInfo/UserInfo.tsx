import React, {ReactNode, useId} from 'react';
import styles from "./UserInfo.module.scss"
import Section from "./Section";
import {UserDetails} from "../../../models/UserDetails";
import {useContextMenu} from "../ContextMenu/ContextMenuProvider";

type Props = {
    userDetails: UserDetails;
    children?: ReactNode;
}
const UserInfo = ({userDetails, children}: Props) => {
    return (
        <div className={styles.panel}>
            <div className={styles.profileColor}>
                <div className={styles.iconContainer}>
                    <img src={userDetails.avatar} alt={"avatar"}/>
                </div>
            </div>
            <div className={styles.info}>
                <h1>{userDetails.serverProfile?.displayName ?? userDetails.displayName ?? userDetails.username}</h1>
                <h2>{userDetails.username}</h2>
                <p>{userDetails.textStatus}</p>
                <hr/>
                <Section header={"About me"}>
                    <p>About me kinda</p>
                </Section>
                <Section header={"Member since"}>
                    <p>10 June 2023 (kinda)</p>
                </Section>
                {userDetails.serverProfile ?
                    <>
                        <hr/>
                        <Section header={"Server member since"}>
                            <p>10 June 2023 (kinda)</p>
                        </Section>
                        <Section header={"Roles"}>
                            <div className={styles.roleContainer}>
                                {userDetails.serverProfile.roles?.map(r => (
                                    <div className={styles.role}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                             viewBox="0 0 10 10" fill="none">
                                            <circle cx="5" cy="5" r="5" fill={r.color}/>
                                        </svg>
                                        <p>{r.name}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </>
                    : null}
                {children}
            </div>
        </div>
    );
};

export default UserInfo;