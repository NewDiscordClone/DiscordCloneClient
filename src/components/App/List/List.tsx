import React from 'react';
import styles from "./List.module.scss"
import ChatListItem from "./ChatListItem";
import PrivateChat from "../../../models/PrivateChat";
import IListElement from "./IListElement";
import UserListItem from "./UserListItem";
import ListItem from "./ListItem";
const List = ({chats} : {chats: PrivateChat[]}) => {

    return (
        <ul className={styles.container}>
            {chats.map(c => {
                let element: IListElement
                if(c.users.length < 3)
                {
                    element = new UserListItem(c.users[0]); //TODO: Замінити на вибір відносного співрозмовника
                }
                else {
                    element = new ChatListItem(c);
                }
                return <ListItem element={element}/>
            })}
        </ul>
    );
}
export default List;