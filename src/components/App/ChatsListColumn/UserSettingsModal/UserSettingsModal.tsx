import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styles from "./UserSettingsModal.module.scss"
import {AppContext, SelectedServerContext} from "../../../../Contexts";
import Select from "../../../Select/Select";
import ServerLookUp from "../../../../models/ServerLookUp";
import {ServerProfileDto} from "../../../../models/UserDetails";
import {signoutRedirect} from "../../../../auth/user-service";

const UserSettingsModal = () => {
    const {user, getData, servers} = useContext(AppContext);
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
        if(!selectedServerId) return;
        onServerSelected(servers[selectedServerId] ?? servers[Object.keys(servers).find(key => key!=="") as string]);
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
                .changeServerProfileDisplayName(selectedServer.id, serverProfile.id, serverProfile.displayName);
    }

    function changeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        // console.log(file);
        if (file && (
            file.name.toLowerCase().endsWith(".png") ||
            file.name.toLowerCase().endsWith(".jpg") ||
            file.name.toLowerCase().endsWith(".jpeg") ||
            file.name.toLowerCase().endsWith(".gif") ||
            file.name.toLowerCase().endsWith(".webp"))) {
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
        if(aboutMe !== user.aboutMe)
            getData.users.updateAboutMe(aboutMe)
    }

    return (
        <div className={styles.modalWindow}>
            <div className={styles.profileColor}>
                <h2>My Profile</h2>
                <div className={styles.iconContainer}>
                    <img src={user.avatar} alt={"avatar"}/>
                </div>
            </div>
            <div className={styles.blockSection}>
                <div className={styles.inputSection}>
                    <h3>Display Name</h3>
                    <input type={"text"}
                           placeholder={user.username}
                           defaultValue={user.displayName}
                           maxLength={32}
                           onBlur={e => changeDisplayName(e.target.value)}
                           onKeyDown={onKey}/>
                </div>
                <div className={styles.inputSection}>
                    <h3>UserName</h3>
                    <input type={"text"}
                           placeholder={user.username}
                           defaultValue={user.username}
                           maxLength={32}
                           onBlur={e => changeUserName(e.target.value)}
                           onKeyDown={onKey}/>
                </div>
                <div className={styles.inputSection}>
                    <h3>Status</h3>
                    <input type={"text"}
                           placeholder={"What happening now"}
                           defaultValue={user.textStatus}
                           maxLength={200}
                           onBlur={e => changeTextStatus(e.target.value)}
                           onKeyDown={onKey}/>
                </div>
                <div className={styles.inputSection}>
                    <h3>Avatar</h3>
                    <div className={styles.button} onClick={() => uploadRef.current?.click()}>Change</div>
                    <input type={"file"}
                           style={{display: "none"}}
                           ref={uploadRef as any}
                           placeholder={user.displayName ?? user.username}
                           onChange={changeAvatar}/>
                </div>
                <div className={styles.inputSection}>
                    <h3>About me</h3>
                    <textarea placeholder={"Tell your friends about yourself"}
                              defaultValue={user.aboutMe}
                              maxLength={200}
                              onBlur={e => changeAboutMe(e.target.value)}/>
                </div>
            </div>
            <div className={styles.blockSection}>
                <div className={styles.inputSection}>
                    <h3>Choose a server</h3>
                    {Object.keys(servers).length > 1 ?
                        <Select className={styles.select}
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
                </div>
                <div className={styles.inputSection}>
                    <h3>Server Display Name</h3>
                    <input type={"text"}
                           placeholder={user.displayName ?? user.username}
                           value={serverProfile?.displayName}
                           maxLength={32}
                           onChange={e => setServerProfile(prev => prev && ({...prev, displayName: e.target.value}))}
                           onBlur={(e) => changeServerProfileName()}
                           disabled={Object.keys(servers).length <= 1 || !selectedServer || !selectedServer.id}
                           onKeyDown={onKey}
                    />
                </div>
            </div>
            <div className={styles.blockSection}>
                <div className={styles.inputSection}>
                    <div className={styles.button} onClick={signOut}>
                        Sign Out
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettingsModal;