import React, {useContext, useEffect, useState} from 'react';
import styles from "./PinnedMessagesPopUp.module.scss"
import Message from "../../../../models/Message";
import {AppContext} from "../../../../Contexts";
import MessageView from "../MessageSpace/MessageView/MessageView";
import MessageViewModel from "../MessageSpace/MessageView/MessageViewModel";
import CloseModalButton from "../../CloseModalButton/CloseModalButton";

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
                    <CloseModalButton close={close}/>
                    <h2>Pinned Messages</h2>
                </div>
                {messages !== undefined &&
                messages.length > 0 ?
                    <>{messages.map(m => <MessageView
                        key={m.id}
                        message={new MessageViewModel(m, users)}
                        isEdit={false}
                        setEdit={() => {}}
                        dateDivider={false}
                    />)}
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