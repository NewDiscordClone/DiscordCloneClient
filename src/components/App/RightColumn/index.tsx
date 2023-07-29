import React, {useEffect, useState} from 'react';
import styles from "./RightColumn.module.scss"
import csx from 'classnames'
import PrivateChat from "../../../models/PrivateChat";
import List from "../List/List";
import {UserStatus} from "../../../models/User";
import ChatSpace from "./ChatSpace/ChatSpace";

const widthToHide = 1130
const chatsList: PrivateChat[] = [
    {
        id: 1,
        image: undefined,
        title: undefined,
        messages: [],
        users: [{
            id: 1,
            displayName: "user",
            username: "user",
            avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
            status: UserStatus.idle,
            textStatus: "null"
        }]
    },
    {
        id: 2,
        image: "https://www.seekpng.com/png/detail/967-9676420_group-icon-org2x-group-icon-orange.png",
        title: "Group",
        messages: [],
        users: [
            {
                id: 1,
                displayName: "user",
                username: "user",
                avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
                status: UserStatus.idle,
                textStatus: null
            },
            {
                id: 1,
                displayName: "user",
                username: "user",
                avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
                status: UserStatus.offline,
                textStatus: "I'm Good"
            },
            {
                id: 1,
                displayName: "user",
                username: "user",
                avatarPath: "https://archive.org/download/discordprofilepictures/discordred.png",
                status: UserStatus.online,
                textStatus: "Talk to me pls"
            }
        ]
    }
]
const RightColumn = () => {
    const [hideInfo, setHideInfo] = useState<boolean>(false)

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
        return () => {
            window.removeEventListener('resize', updatePageWidth);
        };
    }, []);



    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <List chats={chatsList}/>
            </div>
            <div className={styles.middleColumn}>
                <ChatSpace/>
            </div>
            <div className={csx(styles.rightColumn, {[styles.hide]: hideInfo})}></div>
        </div>
    );
};

export default RightColumn;