import React, {useContext, useState} from 'react';
import styles from "./RelationshipSpace.module.scss"
import appStyles from "../App.module.scss"
import {AppContext} from "../../../Contexts";
import {RelationshipType, UserStatus} from "../../../api/GetServerData";
import {Relationship} from "../../../models/Relationship";
import csx from "classnames";
import RelationshipUser from "./RelationshipUser";
import RelationshipTabs from "./RelationshipTabs";

export enum Tab {
    Online,
    All,
    Pending,
    Blocked,
    AddFriend
}

const RelationshipSpace = () => {
    const {getData, relationships} = useContext(AppContext);
    const [tab, setTab] = useState<Tab>(Tab.All);
    const [search, setSearch] = useState("");

    let usersOfTab: Relationship[] = [];
    switch (tab) {
        case Tab.Online:
            usersOfTab = relationships.filter(r =>
                r.relationshipType === RelationshipType.Friend &&
                r.user?.status === UserStatus.Online)
            break;
        case Tab.All:
            usersOfTab = relationships.filter(r =>
                r.relationshipType === RelationshipType.Friend)
            break;
        case Tab.Pending:
            usersOfTab = relationships.filter(r =>
                r.relationshipType === RelationshipType.Pending).concat(relationships.filter(r =>
                r.relationshipType === RelationshipType.Waiting));
            break;
        case Tab.Blocked:
            usersOfTab = relationships.filter(r =>
                r.relationshipType === RelationshipType.Blocked);
            break;
        case Tab.AddFriend:
            break;
    }
    const usersToShow = search ?
        usersOfTab.filter(u => u.user.displayName.toLowerCase().includes(search.toLowerCase())) :
        usersOfTab;

    function sendFriendRequest(){
        getData
            .getUserByUserName(search)
            .then(id => getData.sendFriendRequest(id))
            .then(() => setSearch(""))
    }

    return (

        <div className={styles.friendsField}>
            <RelationshipTabs tab={tab} setTab={setTab}/>
            {tab !== Tab.AddFriend ?
                usersOfTab.length > 0 ?
                    <>
                        <input type={"text"}
                               placeholder={"Search"}
                               className={appStyles.customInput}
                               value={search}
                               onChange={({target: {value}}) => setSearch(value)}/>
                        <ul className={styles.list}>
                            {usersToShow.map(u => <RelationshipUser key={u.user.id} relationship={u}/>)}
                        </ul>
                    </>
                    :
                    <div style={{
                        flex: "1",
                        marginTop: "30%",
                        color: "white",
                        justifyContent: "center",
                        textAlign: "center"
                    }}>
                        <p>Користувачів немає</p>
                    </div>
                :
                <div className={styles.addFriendSection}>
                    <h2>Add Friend</h2>
                    <span>You can add friends with their Sparkle usernames.</span>
                    <div className={styles.inputContainer}>
                    <input type={"text"}
                           maxLength={100}
                           placeholder={"You can add friends with their Sparkle usernames."}
                           className={csx(appStyles.customInput, styles.input)}
                           value={search}
                           onChange={({target: {value}}) => setSearch(value)}/>
                        <div
                            className={csx(styles.submitButton, {[styles.disabled]: search.length <= 0})}
                            onClick={() => search.length > 0 ? sendFriendRequest() : null}>
                            Send Friend Request
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default RelationshipSpace;