import React, { useContext } from 'react';
import styles from "./Server.module.scss";
import ServerIcon from "./ServerIcon";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../../Contexts";
import PrivateServerIcon from "./PrivateServerIcon";
import AddServerIcon from "./AddServerIcon";
import PrivateChatIcon from "./PrivateChatIcon";

type Props = {
    selectedServer: string | undefined;
}
const ServerColumn = ({selectedServer} : Props) => {
    const {servers, privateChats} = useContext(AppContext);
    const {selectServer} = useContext(SelectedServerContext);
    const {selectChat} = useContext(SelectedChatContext);

    function onChatClick(chatId: string) {
        selectServer(undefined)
        selectChat(chatId)
    }

    return (
        <div className={styles.serversColumn}>
            <PrivateServerIcon isSelected={selectedServer === undefined} onServerClick={selectServer}/>
            <div className={styles.incomeMessages}>
                {Object.values(privateChats).filter(c => c.unreadMessagesCount > 0).map(c =>
                    <PrivateChatIcon key={c.id} chat={c} onClick={onChatClick}/>)
                }
                <div className={styles.separator}/>
            </div>
            {Object.values(servers).filter(s => s.id).map(s =>
                <ServerIcon
                    key={s.id}
                    server={s}
                    isSelected={selectedServer === s.id}
                    onServerClick={selectServer}/>)}
            <AddServerIcon selectServer={selectServer}/>
        </div>
    );
};

export default ServerColumn;