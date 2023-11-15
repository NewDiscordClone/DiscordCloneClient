import React from 'react';
import tabStyles from "./Emojis.module.scss";
import groupsJson from "./group-emoji.json";
import GroupDictionary from "./GroupDictionary";
import GroupIcon from "./GroupIcon";

const groups = groupsJson as unknown as GroupDictionary
type Props = {
    selectedGroup: string
}
const GroupsPanel = ({selectedGroup}: Props) => {
    return (
        <div className={tabStyles.groupsPanel}>
            {Object.keys(groups).map(g => <GroupIcon group={g} isSelected={g===selectedGroup}/>)}
        </div>
    );
};

export default GroupsPanel;