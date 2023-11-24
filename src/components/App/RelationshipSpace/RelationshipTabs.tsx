import React, {useContext} from 'react';
import styles from "./RelationshipSpace.module.scss";
import csx from "classnames";
import {Tab} from "./RelationshipSpace";
import {RelationshipType} from "../../../models/Relationship";
import {AppContext} from "../../../Contexts";

type Props = {
    tab: Tab,
    setTab: (tab: Tab) => void
}
const RelationshipTabs = ({tab, setTab}: Props) => {
    const {relationships} = useContext(AppContext)

    const pendingAmount = relationships.filter(r =>
        r.type === RelationshipType.Pending &&
        r.isActive
    ).length
    return (
        <div className={styles.firstRow}>
            <div className={csx(styles.tab, {[styles.selected]: tab === Tab.Online})}
                 onClick={() => setTab(Tab.Online)}>
                ONLINE
            </div>
            <div className={csx(styles.tab, {[styles.selected]: tab === Tab.All})}
                 onClick={() => setTab(Tab.All)}>
                ALL
            </div>
            <div className={csx(styles.tab, {[styles.selected]: tab === Tab.Pending})}
                 onClick={() => setTab(Tab.Pending)}>
                PENDING
                {pendingAmount > 0 &&
					<div className={styles.pendingAmount}>
                        {pendingAmount}
					</div>
                }
            </div>
            <div className={csx(styles.tab, {[styles.selected]: tab === Tab.Blocked})}
                 onClick={() => setTab(Tab.Blocked)}>
                BLOCKED
            </div>
            <div className={csx(styles.addFriendTab, styles.tab, {[styles.selected]: tab === Tab.AddFriend})}
                 onClick={() => setTab(Tab.AddFriend)}>
                ADD FRIEND
            </div>
        </div>
    );
};

export default RelationshipTabs;