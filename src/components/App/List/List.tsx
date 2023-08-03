import React from 'react';
import styles from "./List.module.scss"
import GroupChatListItem from "./GroupChatListItem";
import PrivateChat from "../../../models/PrivateChat";
import IListElement from "./IListElement";
import UserChatListItem from "./UserChatListItem";
import ListItem from "./ListItem";
const List = ({elements} : {elements: IListElement[]}) => {

    return (
        <ul className={styles.container}>
            {elements.map(e => <ListItem key={e.id} element={e}/>)}
        </ul>
    );
}
export default List;