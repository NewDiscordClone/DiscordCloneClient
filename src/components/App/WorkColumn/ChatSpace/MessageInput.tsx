import React, {useContext, useState} from 'react';
import styles from './ChatSpace.module.scss'
import {AppContext, SelectedChatContext} from "../../../../Contexts";

const MessageInput = () => {
    const {getData} = useContext(AppContext);
    const chat = useContext(SelectedChatContext);
    const [message, setMessage] = useState<string>("");
    const [height, setHeight] = useState<string>();
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            getData.sendMessage({
                text: message,
                chatId: chat.id as number,
                attachments: []
            });
            setMessage("");
        }
    };
    const handleChange = (area:any) =>{
        setMessage(area.target.value);
        setHeight(area.scrollHeight+"px")
    }

    return (
        <input
            type={"text"}
            className={styles.customInput}
            placeholder="Type here..."
            value={message}
            style={({height: height})}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
        />
    );
};

export default MessageInput;