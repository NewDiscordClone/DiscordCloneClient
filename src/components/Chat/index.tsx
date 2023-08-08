import React, {useEffect, useState} from 'react';
import WebsocketService from "../../ChatWebSocketService";
import Message from "../../models/Message";

const Chat = () => {
    const [curMessage, setCurMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const onMessageAdded = (message:string) => {
        setMessages(prevState => {
            let newArr = prevState.map(e =>e);
            newArr.push(message)
            return newArr
        });
    }

    useEffect(() => {
        WebsocketService.registerMessageAdded(onMessageAdded)
    }, [])

    const onClickButton = () => {
        WebsocketService.sendMessage(curMessage);
        setCurMessage("");
    }

    return (
        <>
            <input type={"text"} value={curMessage} onChange={({target: {value}}) => {setCurMessage(value)}}/>
            <button type={"button"} onClick={onClickButton}>send</button>
            <ul>
                {messages.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
        </>
    );
};

export default Chat;