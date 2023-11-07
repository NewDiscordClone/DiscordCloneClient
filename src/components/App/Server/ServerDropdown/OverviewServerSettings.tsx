import React, {useContext, useRef} from 'react';
import SettingsModal from "../../SettingsModal/SettingsModal";
import TopPanel from "../../SettingsModal/TopPanel";
import ServerDetailsDto from "../../../../models/ServerDetailsDto";
import BlockSection from "../../SettingsModal/BlockSection";
import InputSection from "../../SettingsModal/InputSection";
import {AppContext} from "../../../../Contexts";
import Button from "../../SettingsModal/Button";

const imagePattern = /\.(png|jpg|jpeg|gif|webp)$/;

type Props = {
    server: ServerDetailsDto;
}
const OverviewServerSettings = ({server}: Props) => {
    const {getData} = useContext(AppContext)
    const uploadRef = useRef<HTMLInputElement>();
    function onKey(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter")
            event.currentTarget.blur();
    }

    function changeName(name: string) {
        if (name !== server.title)
            getData.servers.updateServer(server.id, {title: name, image: server.image})
    }
    function changeImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        // console.log(file);
        if (file && imagePattern.test(file.name.toLowerCase())) {
            const formData = new FormData();
            formData.append('file', file);
            getData.media.uploadMedia(formData)
                .then(mediaIds => getData.servers.updateServer(server.id, {title: server.title, image: mediaIds[0]}))
        }
    }

    return (
        <SettingsModal>
            <TopPanel title={"Server Overview"} icon={server.image}/>
            <BlockSection>
                <InputSection title={"Server name"}>
                    <input type={"text"}
                           placeholder={server.title}
                           defaultValue={server.title}
                           maxLength={32}
                           onBlur={e => changeName(e.target.value)}
                           onKeyDown={onKey}/>
                </InputSection>
                <InputSection title={"Server image"}>
                    <Button title={"Change"} onClick={() => uploadRef.current?.click()}/>
                    <input type={"file"}
                           style={{display: "none"}}
                           ref={uploadRef as any}
                           onChange={changeImage}/>
                </InputSection>
            </BlockSection>
        </SettingsModal>
    );
};

export default OverviewServerSettings;