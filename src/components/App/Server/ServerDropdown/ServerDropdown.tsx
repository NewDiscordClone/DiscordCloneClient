import React, {useContext, useRef, useState} from 'react';
import {AppContext, SelectedServerContext} from "../../../../Contexts";
import styles from "./ServerDropdown.module.scss"
import {ContextOption} from "../../ContextMenu/ContextOption";
import ContextMenu from "../../ContextMenu/ContextMenu";
import Modal from "../../Modal/Modal";
import OverviewServerSettings from "./OverviewServerSettings";
import InviteFriendsModal from "./InviteFriendsModal/InviteFriendsModal";
import CreateChannelModal from "../CreateChannelModal/CreateChannelModal";
import RolesManagerModal from "../RolesMannagerModal/RolesManagerModal";
import {ActionType} from "../../reducer";

const ServerDropdown = () => {
    const {servers, getData, profiles, user, dispatch} = useContext(AppContext);
    const {selectedServerId, selectServer} = useContext(SelectedServerContext);
    if (!selectedServerId) throw new Error("selectedServerId can't be undefined at this point");
    const server = servers[selectedServerId];
    const [isOpen, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>();

    const [isInviteOpen, setInviteOpen] = useState<boolean>(false)
    const [isOverviewOpen, setOverviewOpen] = useState<boolean>(false)
    const [isCreateChannel, setCreateChannel] = useState<boolean>(false);
    const [isRolesOpen, setRolesOpen] = useState<boolean>(false);

    const options: (ContextOption | null)[] = [
        {
            title: "Invite People",
            action: () => setInviteOpen(true),
            highlight: true,
        },
        null,
        {
            title: "Overview Settings",
            action: () => setOverviewOpen(true)
            ,
        },
        {
            title: "Roles",
            action: () => setRolesOpen(true),
        },
        // {
        //     title: "Bans",
        //     action: () => {
        //     },
        //     disabled: true,
        // },
        // {
        //     title: "Members",
        //     action: () => {
        //     },
        //     disabled: true,
        // },
        {
            title: "Create Channel",
            action: () => {
                setCreateChannel(true);
            },
        },
        {
            title: "Delete Server",
            action: () => {
                getData.servers.deleteServer(selectedServerId)
            },
            danger: true,
        },
        {
            title: "Leave Server",
            action: () => {
                const profileId = Object.values(profiles).find(p => p.userId === user.id)?.id;
                if (!profileId) throw new Error("couldn't find the profile");
                getData.servers
                    .leaveServer(selectedServerId,
                        profileId)
                    .then(() => {
                        selectServer(undefined)
                        dispatch({type: ActionType.ServerProfileRemoved, value: {id: profileId}})
                    })
            },
            danger: true,
        },
    ]

    function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        setOpen(true);
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.title}
                onClick={() => setOpen(true)}
                onContextMenu={handleContextMenu}
                ref={ref as any}>
                <h2>{server.title}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9" fill="none">
                    <path
                        d="M7.15196 5.9215L7.5 6.25892L7.84804 5.9215L13.2371 0.696783L14.2825 1.71255L7.5 8.30284L0.717493 1.71255L1.76289 0.696782L7.15196 5.9215Z"
                        fill="currentColor" stroke="currentColor"/>
                </svg>
            </div>
            {isOpen &&
				<ContextMenu className={styles.dropdown} options={options} outerRef={ref}
							 closeMenu={() => setOpen(false)}/>
            }
            <Modal isOpen={isOverviewOpen} setOpen={setOverviewOpen}>
                <OverviewServerSettings server={server as any}/>
            </Modal>
            <Modal isOpen={isInviteOpen} setOpen={setInviteOpen}>
                <InviteFriendsModal server={server as any}/>
            </Modal>
            <Modal isOpen={isRolesOpen} setOpen={setRolesOpen}>
                <RolesManagerModal server={server as any}/>
            </Modal>
            <Modal isOpen={isCreateChannel} setOpen={setCreateChannel}>
                <CreateChannelModal/>
            </Modal>
        </div>
    );
};

export default ServerDropdown;