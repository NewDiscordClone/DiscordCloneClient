import React, {useContext, useEffect, useState} from 'react';
import styles from "./RightColumn.module.scss"
import csx from 'classnames'
import PrivateChat from "../../../models/PrivateChat";
import List from "../List/List";
import User, {UserStatus} from "../../../models/User";
import ChatSpace from "./ChatSpace/ChatSpace";
import IListElement from "../List/IListElement";
import UserListItem from "../List/UserListItem";
import ChatListItem from "../List/ChatListItem";
import ListItem from "../List/ListItem";
import {GetDataContext} from "../../../Contexts";
import Chat from "../../../models/Chat";

const widthToHide = 1130
const WorkColumn = () => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const getData = useContext(GetDataContext);
    const [chats, setChats] = useState<PrivateChat[]>(getData.privateChats)

    // Function to update the page width in the state
    const updatePageWidth = () => {
        setHideInfo(window.innerWidth < widthToHide)
    };
    // useEffect hook to set up the event listener for window resize
    useEffect(() => {
        // Add event listener to update the page width when the window is resized
        window.addEventListener('resize', updatePageWidth);
        updatePageWidth();
        // Clean up the event listener when the component is unmounted
        setChats(
            getData.privateChats
        )

        return () => {
            window.removeEventListener('resize', updatePageWidth);
        };
    }, []);

    const selectChat = (chat: IListElement) => {
        //TODO: Реалізувати
        console.log(chat)
    }


    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <List elements=
                      {chats.map(c => {
                          let element : IListElement
                          if (c.users.length === 2) {
                              element = new UserListItem(c.users.find(u => u.id !== getData.user.id) as User);
                              //Замінити на вибір відносного співрозмовника TODO: Перевірити чи змінилося
                          } else {
                              element = new ChatListItem(c);
                          }
                          element.clickAction = () => selectChat(element);
                          return element;

                      })}
                />
            </div>
            <div className={styles.middleColumn}>
                <ChatSpace/>
            </div>
            <div className={csx(styles.rightColumn, {[styles.hide]: hideInfo})}></div>
        </div>
    );
};

export default WorkColumn;