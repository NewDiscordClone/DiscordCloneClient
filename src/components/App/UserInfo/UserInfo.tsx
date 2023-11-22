import React, {ReactNode, useContext, useId} from 'react';
import styles from "./UserInfo.module.scss"
import Section from "./Section";
import {UserDetails} from "../../../models/UserDetails";
import {useContextMenu} from "../ContextMenu/ContextMenuProvider";
import {AppContext} from "../../../Contexts";
import csx from "classnames";

type Props = {
    className?: string;
    userDetails: UserDetails;
    children?: ReactNode;
}
const UserInfo = ({userDetails, children, className}: Props) => {
    const {media} = useContext(AppContext);

    return (
        <div className={csx(styles.panel, className)}>
            <div className={styles.profileColor}>
                <div className={styles.iconContainer}>
                    <img src={userDetails.avatar ? media[userDetails.avatar] as string | undefined | null ?? undefined: undefined} alt={"avatar"}/>
                </div>
            </div>
            <div className={styles.info}>
                <h1>{userDetails.serverProfile?.name ?? userDetails.displayName ?? userDetails.username}</h1>
                <h2>{userDetails.username}</h2>
                <p>{userDetails.textStatus}</p>
                <hr/>
                {userDetails.aboutMe &&
					<Section header={"About me"}>
						<p>{userDetails.aboutMe}</p>
					</Section>
                }
                <Section header={"Member since"}>
                    <p>10 June 2023 (kinda)</p>
                </Section>
                {userDetails.serverProfile &&
					<>
						<hr/>
						<Section header={"Server member since"}>
							<p>10 June 2023 (kinda)</p>
						</Section>

						<Section header={
                            userDetails.serverProfile.roles && userDetails.serverProfile.roles?.length > 0?
                                "Roles": "No Roles"}>
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
                }
                {children}
            </div>
        </div>
    );
};

export default UserInfo;