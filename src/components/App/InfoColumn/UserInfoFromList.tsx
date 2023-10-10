import React, {MutableRefObject, useContext, useEffect, useRef, useState} from 'react';
import UserListElement from "../List/UserListElement";
import {UserDetails} from "../../../models/UserDetails";
import {AppContext} from "../../../Contexts";
import UserInfo from "../UserInfo/UserInfo";
import styles from "./InfoColumn.module.scss"

type Props = {
    listElement: UserListElement
    serverId: string | undefined
    selectedUser: string | undefined
    selectUser: (user: string | undefined) => void;
    containerRef: MutableRefObject<HTMLLIElement | undefined>
}
const UserInfoFromList = ({listElement, serverId, selectedUser, selectUser, containerRef}: Props) => {
    const {getData} = useContext(AppContext);
    const [userDetails, setUserDetails] = useState<UserDetails>();

    useEffect(() => {
        if (selectedUser === listElement.id && !userDetails) {
            getData.users
                .getUser(listElement.id, serverId)
                .then(u => setUserDetails(u));
        }

    }, [getData.users, listElement.id, selectedUser, serverId])
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
    }, [containerRef, selectedUser])

    if (!userDetails || selectedUser !== listElement.id) return <></>
    return (
        <div className={styles.infoContainer}>
            <UserInfo userDetails={userDetails}/>
        </div>
    );
};

export default UserInfoFromList;