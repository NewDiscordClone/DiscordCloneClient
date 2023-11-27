import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AppContext, SelectedServerContext} from "../../../../Contexts";
import Select from "../../SettingsModal/Select";
import ServerLookUp from "../../../../models/ServerLookUp";
import {ServerProfileDto} from "../../../../models/UserDetails";
import {signoutRedirect} from "../../../../auth/user-service";
import SettingsModal from "../../SettingsModal/SettingsModal";
import TopPanel from "../../SettingsModal/TopPanel";
import BlockSection from "../../SettingsModal/BlockSection";
import InputSection from "../../SettingsModal/InputSection";
import Button from "../../SettingsModal/Button";

const imagePattern = /\.(png|jpg|jpeg|gif|webp)$/;
const UserSettingsModal = () => {
    const {user, getData, servers, media} = useContext(AppContext);
    const {selectedServerId} = useContext(SelectedServerContext);
    const [selectedServer, selectServer] = useState<ServerLookUp>()
    const uploadRef = useRef<HTMLInputElement>();
    const [serverProfile, setServerProfile] = useState<ServerProfileDto>();

    const onServerSelected = useCallback((server: ServerLookUp | undefined) => {
        if (!server) return;
        selectServer(server);
        setServerProfile(undefined)
        getData.users.getUser(user.id, server.id)
            .then(u => setServerProfile(u.serverProfile));
    }, [getData.users, user.id]);

    useEffect(() => {
        if (!selectedServerId) return;
        onServerSelected(servers[selectedServerId] ?? servers[Object.keys(servers).find(key => key !== "") as string]);
    }, [onServerSelected, selectedServerId, servers])

    function onKey(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter")
            event.currentTarget.blur();
    }

    function changeDisplayName(displayName: string) {
        if (displayName !== user.displayName)
            getData.users.updateDisplayName(displayName)
    }

    function changeTextStatus(textStatus: string) {
        if (textStatus !== user.textStatus)
            getData.users.updateTextStatus(textStatus)
    }

    function changeUserName(userName: string) {
        if (userName !== user.username)
            getData.users.updateUserName(userName);
    }

    function changeServerProfileName() {
        if (selectedServer && selectedServer.id && serverProfile)
            getData.serverProfiles
                .changeServerProfileDisplayName(selectedServer.id, serverProfile.id, serverProfile.name);
    }

    function changeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        // console.log(file);
        if (file && imagePattern.test(file.name.toLowerCase())) {
            const formData = new FormData();
            formData.append('file', file);
            getData.media.uploadMedia(formData)
                .then(mediaIds => getData.users.updateAvatar(mediaIds[0]))
        }
    }

    function signOut() {
        signoutRedirect();
    }


    function changeAboutMe(aboutMe: string) {
        if (aboutMe !== user.aboutMe)
            getData.users.updateAboutMe(aboutMe)
    }

    return (
        <SettingsModal>
            <TopPanel title={"My Profile"} icon={user.avatar? media[user.avatar] as string : undefined}/>
            <BlockSection>
                <InputSection title={"Display Name"}>
                    <input type={"text"}
                           placeholder={user.username}
                           defaultValue={user.displayName}
                           maxLength={32}
                           onBlur={e => changeDisplayName(e.target.value)}
                           onKeyDown={onKey}/>
                </InputSection>
                <InputSection title={"UserName"}>
                    <input type={"text"}
                           placeholder={user.username}
                           defaultValue={user.username}
                           maxLength={32}
                           onBlur={e => changeUserName(e.target.value)}
                           onKeyDown={onKey}/>
                </InputSection>
                <InputSection title={"Status"}>
                    <input type={"text"}
                           placeholder={"What happening now"}
                           defaultValue={user.textStatus}
                           maxLength={200}
                           onBlur={e => changeTextStatus(e.target.value)}
                           onKeyDown={onKey}/>
                </InputSection>
                <InputSection title={"Avatar"}>
                    <Button title={"Change"} onClick={() => uploadRef.current?.click()}/>
                    <input type={"file"}
                           style={{display: "none"}}
                           ref={uploadRef as any}
                           onChange={changeAvatar}/>
                </InputSection>
                <InputSection title={"About me"}>
                    <textarea placeholder={"Tell your friends about yourself"}
                              defaultValue={user.aboutMe}
                              maxLength={200}
                              onBlur={e => changeAboutMe(e.target.value)}/>
                </InputSection>
            </BlockSection>
            <BlockSection>
                <InputSection title={"Choose a server"}>
                    {Object.keys(servers).length > 1 ?
                        <Select
                                elements={Object.values(servers).filter(s => s.id).map(s => ({
                                    ...s,
                                    title: s.title as string,
                                    icon: s.image
                                }))}
                                value={{
                                    ...selectedServer,
                                    title: selectedServer?.title as string,
                                    icon: selectedServer?.image
                                }}
                                onChange={(e) => onServerSelected(e)}/>
                        : <input placeholder={"You are not a member of any server"} disabled/>
                    }
                </InputSection>
                <InputSection title={"Server Display Name"}>
                    <input type={"text"}
                           placeholder={user.displayName ?? user.username}
                           value={serverProfile?.name}
                           maxLength={32}
                           onChange={e => setServerProfile(prev => prev && ({...prev, name: e.target.value}))}
                           onBlur={(e) => changeServerProfileName()}
                           disabled={Object.keys(servers).length <= 1 || !selectedServer || !selectedServer.id}
                           onKeyDown={onKey}
                    />
                </InputSection>
            </BlockSection>
            <BlockSection>
                <InputSection>
                    <Button title={"Sign Out"} onClick={signOut}/>
                </InputSection>
            </BlockSection>
        </SettingsModal>
    );
};

export default UserSettingsModal;