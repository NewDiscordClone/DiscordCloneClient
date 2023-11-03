import React, {ReactNode, useContext, useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./InfoColumn.module.scss";
import {AppContext, SelectedChatContext} from "../../../Contexts";
import ServerInfoColumn from "./ServerInfoColumn";
import UserInfoColumn from "./UserInfoColumn";
import GroupChatInfoColumn from "./GroupChatInfoColumn";

const widthToHide = 1130

type Props = {
    hidden: boolean
}
const InfoColumn = ({hidden}: Props) => {
    const [hideInfo, setHideInfo] = useState<boolean>(window.innerWidth < widthToHide)
    const {chats} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const chat = selectedChatId? chats[selectedChatId] : undefined;

    useEffect(() => {
        const updatePageWidth = () => {
            setHideInfo(window.innerWidth < widthToHide)
        };
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);

        return () => {
            window.removeEventListener('resize', updatePageWidth);
        };
    }, [])

    function columnWrap(node: ReactNode) {
        return (
            <div className={csx(styles.infoColumn, {[styles.hide]: hidden || hideInfo})}>
                {node}
            </div>
        )
    }

    if (!chat || !selectedChatId)
        return <></>
    else if ("serverId" in chat)
        return columnWrap(<ServerInfoColumn/>)
    else if ("membersCount" in chat)
        return columnWrap(<GroupChatInfoColumn/>)
    else
        return columnWrap(<UserInfoColumn/>)
};

export default InfoColumn;