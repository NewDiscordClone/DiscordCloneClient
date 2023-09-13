import React, {useContext, useState} from 'react';
import styles from './ChatSpace.module.scss'
import {AppContext, SelectedChatContext} from "../../../Contexts";

const MessageInput = () => {
    const {getData} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const [message, setMessage] = useState<string>("");
    const [height, setHeight] = useState<string>();
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            getData.addMessage({
                text: message,
                chatId: selectedChatId as string,
                attachments: []
            });
            setMessage("");
        }
    };
    const handleChange = (area:any) =>{
        setMessage(area.target.value);
        setHeight(area.scrollHeight+"px")
    }
    if(!selectedChatId) return null;

    return (
        <input
            type={"text"}
            className={styles.customInput}
            placeholder="Type here..."
            value={message}
            style={({height: height})}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
        />
    );
};

export default MessageInput;