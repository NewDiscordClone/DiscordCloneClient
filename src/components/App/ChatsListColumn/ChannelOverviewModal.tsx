import React, {useContext} from 'react';
import {AppContext} from "../../../Contexts";
import SettingsModal from "../SettingsModal/SettingsModal";
import TopPanel from "../SettingsModal/TopPanel";
import BlockSection from "../SettingsModal/BlockSection";
import InputSection from "../SettingsModal/InputSection";
import Channel from "../../../models/Channel";

type Props = {
    channelId: string
}
const ChannelOverviewModal = ({channelId}: Props) => {
    const {chats, getData} = useContext(AppContext);
    const channel = chats[channelId] as Channel;

    function onKey(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter")
            event.currentTarget.blur();
    }
    function changeTitle(title: string){
        if(title && title !== channel.title){
            getData.channels.renameChannel(channelId, title, channel.serverId);
        }
    }

    return (
        <SettingsModal>
            <TopPanel title={"Channel Overview"}/>
            <BlockSection>
                <InputSection title={"Channel Title"}>
                    <input type={"text"}
                           placeholder={channel.title}
                           defaultValue={channel.title}
                           maxLength={32}
                           onBlur={e => changeTitle(e.target.value)}
                           onKeyDown={onKey}/>
                </InputSection>
            </BlockSection>
        </SettingsModal>
    );
};

export default ChannelOverviewModal;