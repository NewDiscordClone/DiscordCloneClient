import React from 'react';
import styles from "./ChatSpace.module.scss"
import MessageViewModel from "./MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView";
import {UserStatus} from "../../../../models/User";
import * as string_decoder from "string_decoder";

const message: Message = {
    id: 1,
    sendTime: new Date(2023, 6, 28, 22, 51),
    user: {
        id: 1,
        displayName: "DisplayName",
        avatarPath:"https://archive.org/download/discordprofilepictures/discordred.png",
        status: UserStatus.online,
        textStatus: null,
        username: "UserName"
    },
    serverProfile: undefined,
    text: "hello, this is message number ",
    attachments: [],
    reactions: []
}
const MessageSpace = () => {
    const arr: Message[] = []
    for (let i = 0; i < 200; i++) {
        const text = message.text + i;
        const date = new Date(Number(new Date()) - 3600000 * i);
        arr.push({...message, id:i, text:text, sendTime: date});
    }
    return (
        <div className={styles.messageContainer}>
            {arr.map((m, i) => <MessageView message={new MessageViewModel(m)}
                                            prev={i+1>=arr.length? undefined: arr[i+1]}/>)}
        </div>
    );
};

export default MessageSpace;