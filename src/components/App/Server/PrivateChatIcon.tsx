import React from 'react';
import styles from "./Server.module.scss";
import ServerLookUp from "../../../models/ServerLookUp";
import csx from "classnames";
import PrivateChatLookUp from "../../../models/PrivateChatLookUp";


type Props = {
    chat: PrivateChatLookUp;
    onClick: (chatId: string) => void;
}
const ServerIcon = ({chat, onClick}: Props) => {
    return (
        <div className={styles.chatContainer}>
            <div className={styles.icon}
                 onClick={() => onClick(chat.id)}>
                <span className={styles.tooltip}>{chat.title}</span>
                <img src={chat.image}
                     alt={"chatImage"}/>
            </div>
            <div className={styles.unread}>
                {chat.unreadMessagesCount}
            </div>
        </div>
    );
};

export default ServerIcon;