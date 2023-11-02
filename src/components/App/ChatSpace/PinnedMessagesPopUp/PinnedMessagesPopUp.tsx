import React, {useContext, useEffect, useState} from 'react';
import styles from "./PinnedMessagesPopUp.module.scss"
import Message from "../../../../models/Message";
import {AppContext} from "../../../../Contexts";
import MessageView from "../MessageSpace/MessageView/MessageView";
import MessageViewModel from "../MessageSpace/MessageView/MessageViewModel";

type Props = {
    close: () => void;
    chatId: string;
}
const PinnedMessagesPopUp = ({close, chatId}: Props) => {
    const {getData, users} = useContext(AppContext);
    const [messages, setMessages] = useState<Message[] | undefined>(undefined);

    useEffect(() => {
        getData.messages.getMessages(chatId, 0, true)
            .then(m => setMessages(m));
    }, [chatId, getData.messages])


    return (
        <div className={styles.container}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <svg
                        className={styles.closeButton}
                        width="17" height="17"
                        viewBox="0 0 17 17"
                        fill="none" xmlns="http://www.w3.org/2000/svg" onClick={close}>
                        <path id="Vector"
                              d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z"
                              fill="currentColor"/>
                    </svg>
                    <h2>Pinned Messages</h2>
                </div>
                {messages !== undefined &&
                messages.length > 0 ?
                    <>{messages.map(m => <MessageView
                        key={m.id}
                        message={new MessageViewModel(m, users)}
                        isEdit={false}
                        setEdit={() => {
                        }}/>)}
                    </> :
                    <div className={styles.textContainer}>
                        <h3>This chat doesn't have any pinned messages... yet</h3>
                    </div>
                }
            </div>
        </div>
    );
};

export default PinnedMessagesPopUp;