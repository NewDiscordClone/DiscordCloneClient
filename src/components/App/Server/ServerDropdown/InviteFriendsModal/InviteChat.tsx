import React, {useContext, useState} from 'react';
import styles from "./InviteFriendsModal.module.scss"
import {AppContext} from "../../../../../Contexts";
import PrivateChatLookUp from "../../../../../models/PrivateChatLookUp";
import csx from "classnames";

type Props = {
    chat: PrivateChatLookUp,
    handleSend: (chatId: string) => void
}
const InviteChat = ({chat, handleSend} : Props) => {
    const {media} = useContext(AppContext);
    const [isSent, setSent] = useState<boolean>(false);

    function handleClick() {
        setSent(true);
        handleSend(chat.id)
    }

    return (
        <div className={styles.chat}>
            <div className={styles.iconContainer}>
                <img src={(chat.image? media[chat.image] as string | undefined | null : undefined) ?? undefined} alt={"chat's icon"}/>
            </div>
            <h3>{chat.title}</h3>
            <div className={csx(styles.button, {[styles.disabled]: isSent})} onClick={handleClick}>
                {isSent? "Sent" : "Invite"}
            </div>
        </div>
    );
};

export default InviteChat;