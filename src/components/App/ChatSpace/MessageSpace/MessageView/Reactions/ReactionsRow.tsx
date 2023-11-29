import React, {useContext} from 'react';
import {Reaction} from "../../../../../../models/Reaction";
import styles from "./Reactions.module.scss"
import ReactionIcon from "./ReactionIcon";
import appStyles from "../../../../App.module.scss";
import Twemoji from "react-twemoji";
import {compileString} from "sass";
import {AppContext} from "../../../../../../Contexts";
import Channel from "../../../../../../models/Channel";
import {PrivateChatViewModel} from "../../../../../../models/PrivateChatViewModel";

type Props = {
    chatId: string;
    reactions: Reaction[]
    addReaction: (emoji: string) => void;
    removeReaction: (emoji: string) => void;
}
const ReactionsRow = ({chatId, reactions, addReaction, removeReaction}: Props) => {
    const {user, chats, servers, profiles, privateChats} = useContext(AppContext)
    if(reactions.length === 0) return <></>;
    const chat = chats[chatId];
    let curUserProfileId: string | undefined;
    if("serverId" in chat){
        const serverId = (chat as Channel).serverId;
        curUserProfileId = Object.values(profiles).find(p => p.serverId === serverId && p.userId === user.id)?.id;
    }
    else {
        curUserProfileId = (privateChats[chatId] as PrivateChatViewModel).profiles?.find(p=> p.userId === user.id)?.id;
    }
    console.log(curUserProfileId);
    console.log(reactions);
    const reactionsView: { [e: string]: {isSelected: boolean, count: number } } = {};

    reactions.forEach(r => {
        if(!reactionsView[r.emoji]) reactionsView[r.emoji] = {isSelected: false, count: 0};
        reactionsView[r.emoji].count = reactionsView[r.emoji].count + 1;
        if(curUserProfileId && !reactionsView[r.emoji].isSelected)
            reactionsView[r.emoji].isSelected = r.authorProfile === curUserProfileId;
    })
    function handleOnClick(emoji: string) {
        if(reactionsView[emoji].isSelected) removeReaction(emoji);
        else addReaction(emoji);
    }
    return (
        <Twemoji options={{className: appStyles.emoji}}>
            <div className={styles.row}>
                {Object.keys(reactionsView).map(r =>
                    <ReactionIcon
                        key={r}
                        emoji={r}
                        number={reactionsView[r].count}
                        onClick={handleOnClick}
                        isSelected={reactionsView[r].isSelected}
                    />)}
            </div>
        </Twemoji>
    );
};

export default ReactionsRow;