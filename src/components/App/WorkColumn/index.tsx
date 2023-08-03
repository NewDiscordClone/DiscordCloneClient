import React, {useContext, useEffect, useState} from 'react';
import styles from "./RightColumn.module.scss"
import styles2 from "./ChatSpace/ChatSpace.module.scss"
import csx from 'classnames'
import PrivateChat from "../../../models/PrivateChat";
import List from "../List/List";
import User, {UserStatus} from "../../../models/User";
import ChatSpace from "./ChatSpace/ChatSpace";
import IListElement from "../List/IListElement";
import UserChatListItem from "../List/UserChatListItem";
import GroupChatListItem from "../List/GroupChatListItem";
import ListItem from "../List/ListItem";
import {GetDataContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import IChatListElement from "../List/IChatListElement";
import MessageSpace from "./ChatSpace/MessageSpace";
import MessageInput from "./ChatSpace/MessageInput";

const widthToHide = 1130
const WorkColumn = () => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)
    const getData = useContext(GetDataContext);
    const [chats, setChats] = useState<PrivateChat[]>(getData.privateChats)
    const [selectedChat, selectChat] = useState<PrivateChat | undefined>(undefined)
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

    const onChatClick = (chat: IChatListElement) => {
        selectChat(chat.privateChat)//TODO: Після переключення назад не переключається
        onAddMessages();
        console.log(chat)
    }
    const onAddMessages = () => {
        selectChat(prevState => {
            let chat : PrivateChat = {...prevState} as PrivateChat;
            chat.messages = chat.messages.concat(getData.getMessages(chat, chat.messages.length));
            return chat;
        })
    }


    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <List elements=
                          {chats.map(c => {
                              let element: IChatListElement
                              if (c.users.length === 2) {
                                  element = new UserChatListItem(c, c.users.find(u => u.id !== getData.user.id) as User);
                              } else {
                                  element = new GroupChatListItem(c);
                              }
                              element.clickAction = () => onChatClick(element);
                              return element;

                          })}
                />
            </div>
            <div className={csx(styles.middleColumn, styles2.container)}>
                {selectedChat && <ChatSpace chat={selectedChat} addMessages={onAddMessages}/>}
            </div>
            <div className={csx(styles.rightColumn, {[styles.hide]: hideInfo})}></div>
        </div>
    );
};

export default WorkColumn;