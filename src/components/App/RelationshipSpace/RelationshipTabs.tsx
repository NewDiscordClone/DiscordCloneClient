import React from 'react';
import styles from "./RelationshipSpace.module.scss";
import csx from "classnames";
import {Tab} from "./RelationshipSpace";

type Props = {
    tab: Tab,
    setTab: (tab: Tab) => void
}
const RelationshipTabs = ({tab, setTab} : Props) => {
    return (
        <div className={styles.firstRow}>
            <div className={csx(styles.button, {[styles.selected]: tab === Tab.Online})}
                 onClick={() => setTab(Tab.Online)}>
                ONLINE
            </div>
            <div className={csx(styles.button, {[styles.selected]: tab === Tab.All})}
                 onClick={() => setTab(Tab.All)}>
                ALL
            </div>
            <div className={csx(styles.button, {[styles.selected]: tab === Tab.Pending})}
                 onClick={() => setTab(Tab.Pending)}>
                PENDING
            </div>
            <div className={csx(styles.button, {[styles.selected]: tab === Tab.Blocked})}
                 onClick={() => setTab(Tab.Blocked)}>
                BLOCKED
            </div>
            <div className={csx(styles.addFriendButton, styles.button, {[styles.selected]: tab === Tab.AddFriend})}
                 onClick={() => setTab(Tab.AddFriend)}>
                ADD FRIEND
            </div>
        </div>
    );
};

export default RelationshipTabs;