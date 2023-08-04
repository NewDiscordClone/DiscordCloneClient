import React from 'react';
import styles from "./ChatSpace.module.scss"
import MessageViewModel from "./MessageViewModel";
import Message from "../../../../models/Message";
import MessageView from "./MessageView";

const MessageSpace = ({messages, scrollableRef}: {messages: Message[], scrollableRef : React.MutableRefObject<HTMLDivElement | null>}) => {
    const messagesToView = [...messages];
    return (
        <div className={styles.messageContainer} ref={scrollableRef}>
            {messagesToView.map((m, i) => <MessageView key={i} message={new MessageViewModel(m)}
                                            prev={messagesToView[i+1]}/>)}
        </div>
    );
};

export default MessageSpace;