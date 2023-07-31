import React, {LegacyRef, useRef, useState} from 'react';
import styles from './ChatSpace.module.scss'
const MessageInput = () => {
    const [message, setMessage] = useState<string>();
    const [height, setHeight] = useState<string>();
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            console.log("ENTER")
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