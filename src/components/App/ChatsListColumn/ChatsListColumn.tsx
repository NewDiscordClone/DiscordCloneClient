import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext, SelectedChatContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import List from "../List/List";
import getListElement from "../List/getListElement";
import styles from "./ChatsListColumn.module.scss"
import UserSection from "./UserSection";
import MessageInput from "../ChatSpace/MessageInput/MessageInput";
import CreateChatModal from "./CreateChatModal/CreateChatModal";


type Props = {
    chats: Chat[];
    serverId: string | undefined;
}
const ChatsListColumn = ({chats, serverId}: Props) => {
    const {getData, user} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const [isCreateChat, setCreateChat] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>();

    useEffect(() => {
        function onClick(event: any) {
            if (isCreateChat && selectRef.current && !selectRef.current.contains(event.target)) {
                setCreateChat(false);
            }
        }
        window.addEventListener("click", onClick)
        return () => {
            window.removeEventListener("click", onClick)
        }
    })
    function createChat() {
        if (serverId) {
            if (!serverId) return;
            const title = window.prompt("Type a new Channel name")
            if (!title) return;
            getData.channels.createChannel(serverId, title);
        } else if(!isCreateChat) {
            console.log("set true")
            setCreateChat(true);
            // const title: string | undefined = window.prompt("Type chat title", undefined) ?? undefined;
            // getData.privateChats.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]});
        }
    }

    return (
        <div className={styles.chatListColumn}>
            <div className={styles.mainTitle}>
                <h1 className={styles.sparkleTitle}>SPARKLE</h1>
                {serverId ? null :
                    <div className={styles.friendsButton} onClick={() => selectChat(undefined)}>
                        <img alt={"friends"} src={"icons/friends.svg"} className={styles.icon}/>
                        <h2 className={styles.text}>FRIENDS</h2>
                    </div>
                }
            </div>
                <div className={styles.listTitle}>
                    <h2 style={{marginLeft: "15px"}}>{serverId ? "TEXT CHANNELS" :"PRIVATE MESSAGES"}</h2>
                    <img alt={"cpu"} src={"icons/privateMessages.svg"}/>
                    <div className={styles.plusColumn}>
                        <div className={styles.plusContainer}
                             onClick={createChat}
                             ref={selectRef as any}>
                            <img
                                alt={"createPrivateChat"}
                                src={"icons/createPrivateChat.svg"}
                            />
                            {isCreateChat ?
                                serverId ? null :
                                    <CreateChatModal close={() => {
                                        console.log("clicked close")
                                        setCreateChat(false)
                                    }}/>
                                : null
                            }
                        </div>
                    </div>
                </div>
            <div className={styles.list}>
                <List elements={chats.map(c => getListElement(c, selectChat, c.id === selectedChatId))}/>
            </div>
            <UserSection/>
        </div>
    );
};

export default ChatsListColumn;