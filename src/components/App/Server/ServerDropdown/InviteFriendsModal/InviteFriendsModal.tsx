import React, {useContext, useEffect, useState} from 'react';
import styles from "./InviteFriendsModal.module.scss"
import appStyles from "../../../App.module.scss"
import CloseModalButton from "../../../CloseModalButton/CloseModalButton";
import {ModalContext} from "../../../Modal/Modal";
import ServerDetailsDto from "../../../../../models/ServerDetailsDto";
import {AppContext, SelectedChatContext} from "../../../../../Contexts";
import chat from "../../../../../models/Chat";
import InviteChat from "./InviteChat";

type Props = {
    server: ServerDetailsDto;
}
const InviteFriendsModal = ({server}: Props) => {
    const {getData, privateChats} = useContext(AppContext)
    const {closeModal} = useContext(ModalContext)
    const [search, setSearch] = useState<string>("");
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        getData.invitations.invite(server.id, {expireTime: futureDate, includeUser: true})
            .then(link => setUrl(window.location.origin + "/invitation/" + link));
    }, [server]);

    const chatsToShow = Object.values(privateChats)
        .sort((c1, c2) =>
            new Date(c2.updatedDate).getTime() - new Date(c1.updatedDate).getTime())
        .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

    function handleSend(chatId: string) {
        if (!url) return
        getData.messages.addMessage(
            chatId,
            {
                text: url,
                attachments: undefined}
        )
    }

    return (
        <div className={styles.container}>
            <CloseModalButton close={closeModal}/>
            <h1>Invite friends to {server.title}</h1>
            <input className={appStyles.customInput}
                   type={"text"}
                   value={search}
                   onChange={e => setSearch(e.target.value)}/>
            <div className={styles.chatsContainer}>
                {chatsToShow.map(c => <InviteChat key={c.id} chat={c} handleSend={handleSend}/>)}
            </div>
        </div>
    );
};

export default InviteFriendsModal;