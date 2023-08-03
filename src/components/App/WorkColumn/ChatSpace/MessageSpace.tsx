import React, {useEffect, useRef, useState} from 'react';
import styles from "./ChatSpace.module.scss"
import MessageViewModel from "./MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView";
import {UserStatus} from "../../../../models/User";
import * as string_decoder from "string_decoder";

const MessageSpace = ({messages, scrollableRef}: {messages: Message[], scrollableRef : React.MutableRefObject<HTMLDivElement | null>}) => {
    const messagesToView = [...messages].reverse();
    return (
        <div className={styles.messageContainer} ref={scrollableRef}>
            {messagesToView.map((m, i) => <MessageView key={i} message={new MessageViewModel(m)}
                                            prev={messagesToView[i-1]}/>)}
        </div>
    );
};

export default MessageSpace;