import React, {useContext} from 'react';
import styles from "./ChatsListColumn.module.scss"
import {AppContext} from "../../../Contexts";
import ListItem from "../List/ListItem";
import IListElement from "../List/IListElement";
import UserListElement from "../List/UserListElement";

const UserSection = () => {
    const {user} = useContext(AppContext)

    function getListElement(): IListElement {
        return new UserListElement({
            id: user.id,
            avatar: user.avatar,
            displayName: user.displayName ?? user.username,
            status: user.status,
            textStatus: user.textStatus,
        });
    }

    return (
        <div className={styles.userSection}>
            <ListItem element={getListElement()} isChannel={false}/>
            <div className={styles.iconColumn}>
                <div className={styles.iconContainer}>
                    <img src={"icons/profileSettings.svg"} alt={"profile settings"}/>
                </div>
            </div>
        </div>
    );
};

export default UserSection;