import React, {useContext, useState} from 'react';
import appStyles from "../App.module.scss"
import styles from "./SelectFriendsPopUp.module.scss"
import csx from "classnames";
import {RelationshipType} from "../../../models/Relationship";
import {AppContext} from "../../../Contexts";
import UserButton from "./UserButton";
import UserCheckBox from "./UserCheckBox";
import {UserLookUp} from "../../../models/UserLookUp";

type User = {
    displayName: string;
    id: string;
}
type Props = {
    close: () => void;
    buttonTitle: string;
    buttonClicked: (users: string[]) => void;
    excludeUsers?: string[];
    right?: boolean;
}
const maxUsersCount = 9;
const SelectFriendsPopUp = ({close, buttonTitle, buttonClicked, excludeUsers = [], right = false}: Props) => {
    const {relationships} = useContext(AppContext);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    function lookUpToUser(user: UserLookUp) : User{
        return {id: user.id, displayName: user.displayName};
    }
    function onKeyDown(users: UserLookUp[]) {
        if(users.length === 0) return;
        if(selectedUsers.find(u => u.id === users[0].id))
            unselectUser(users[0].id);
        else
            selectUser(lookUpToUser(users[0]));
        setSearch("");
    }

    const usersLeft = maxUsersCount - (selectedUsers.length + excludeUsers?.length);

    function selectUser(user: User) {
        if (maxUsersCount - selectedUsers.length <= 0) return;
        setSelectedUsers(prev => {
            const newState = [...prev];
            newState.push(user);
            return newState;
        })
    }

    function unselectUser(id: string) {
        setSelectedUsers(prev => {
            return prev.filter(u => u.id !== id);
        })
    }

    let usersToShow = relationships
        .filter(r => r.type === RelationshipType.Friend)
        .map(u => u.user)
        .filter((u) => excludeUsers?.findIndex(eu => eu === u.id) < 0);

    if (search)
        usersToShow = usersToShow.filter(u => u.displayName.toLowerCase().includes(search.toLowerCase()))

    function onClickButton() {
        if(selectedUsers.length <= 0) return;
        buttonClicked(selectedUsers.map(u=>u.id));
        close();
    }
    return (
        <div  className={styles.container} onKeyDown={(event) => event.key === "Enter" && onKeyDown(usersToShow)}>
            <div style={right?{right: "0"} : undefined} className={styles.popup}>
                <svg
                    className={styles.closeButton}
                    width="17" height="17"
                    viewBox="0 0 17 17"
                    fill="none" xmlns="http://www.w3.org/2000/svg" onClick={close}>
                    <path id="Vector" d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z" fill="currentColor"/>
                </svg>
                <h2>Select friends</h2>
                <p>
                    {
                        usersLeft > 0 ?
                            "You can add " + usersLeft + " more friends." :
                            "You can't add any more friends"
                    }
                </p>
                <div className={csx(styles.inputContainer, appStyles.customInput)}>
                    {selectedUsers.map(u => <UserButton key={u.id} user={u} onClick={unselectUser}/>)}
                    <input value={search} onChange={({target: {value}}) => setSearch(value)} type={"text"}
                           maxLength={100} placeholder={"Type the username of a friends"}/>
                </div>
                <div className={styles.friendsContainer}>
                    {usersToShow.length > 0?
                    usersToShow.map(u =>
                        <UserCheckBox
                            key={u.id}
                            user={u}
                            isSelected={selectedUsers.find(su => su.id === u.id) !== undefined}
                            setSelect={(value) => value ? selectUser(lookUpToUser(u)) : unselectUser(u.id)}
                        />
                    ):
                    <div className={styles.textContainer}>
                        <h3>You don't have available friends</h3>
                    </div>
                    }
                </div>
                <div style={{flex: "1"}}/>
                <div className={csx(styles.button, {[styles.disabled]: selectedUsers.length <= 0})} onClick={onClickButton}>{buttonTitle}</div>
            </div>
        </div>
    );
};

export default SelectFriendsPopUp;