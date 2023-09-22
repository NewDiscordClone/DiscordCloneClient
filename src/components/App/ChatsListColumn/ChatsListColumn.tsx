import React, {useContext} from 'react';
import {AppContext, SelectedChatContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import List from "../List/List";
import getListElement from "../List/getListElement";
import styles from "./ChatsListColumn.module.scss"
import UserSection from "./UserSection";


type Props = {
    chats: Chat[];
    isServer: boolean;
}
const ChatsListColumn = ({chats, isServer}: Props) => {
    const {getData, user} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);

    function createChat() {
        const title: string | undefined = window.prompt("Type chat title", undefined) ?? undefined;
        getData.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]});
    }

    return (
        <div className={styles.chatListColumn}>
            <div className={styles.mainTitle}>
                <h1 className={styles.sparkleTitle}>SPARKLE</h1>
                {isServer ? null :
                    <div className={styles.friendsButton} onClick={() => selectChat(undefined)}>
                        <img alt={"friends"} src={"friends.svg"} className={styles.icon}/>
                        <h2 className={styles.text}>FRIENDS</h2>
                    </div>
                }
            </div>
            {isServer ? null :
                <div className={styles.listTitle}>
                    <h2 style={{marginLeft: "15px"}}>PRIVATE MESSAGES</h2>
                    <img alt={"cpu"} src={"privateMessages.svg"}/>
                    <div className={styles.plusColumn}>
                        <div className={styles.plusContainer}
                             onClick={createChat}>
                            <img
                                alt={"createPrivateChat"}
                                src={"createPrivateChat.svg"}
                            />
                        </div>
                    </div>
                </div>
            }
            <div className={styles.list}>
                <List elements={chats.map(c => getListElement(c, selectChat, c.id === selectedChatId))}/>
            </div>
            <UserSection/>
        </div>
    );
};

export default ChatsListColumn;