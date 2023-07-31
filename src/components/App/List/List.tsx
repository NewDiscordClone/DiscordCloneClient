import React from 'react';
import styles from "./List.module.scss"
import ChatListItem from "./ChatListItem";
import PrivateChat from "../../../models/PrivateChat";
import IListElement from "./IListElement";
import UserListItem from "./UserListItem";
import ListItem from "./ListItem";
const List = ({elements} : {elements: IListElement[]}) => {

    return (
        <ul className={styles.container}>
            {elements.map(e => <ListItem element={e}/>)}
        </ul>
    );
}
export default List;