import React, {ChangeEvent, useContext, useEffect, useRef, useState} from 'react';
import appStyles from "../App.module.scss"
import styles from "./ChatSpace.module.scss"
import csx from "classnames";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../../Contexts";
import SelectFriendsPopUp from "../SelectFriendsPopUp/SelectFriendsPopUp";
import Chat from "../../../models/Chat";
import {PrivateChatViewModel} from "../../../models/PrivateChatViewModel";
import {UserDetails} from "../../../models/UserDetails";
import PinnedMessagesPopUp from "./PinnedMessagesPopUp/PinnedMessagesPopUp";

type Props = {
    chat: Chat
    switchSidebar: () => void;
    isSidebarHidden: boolean;
}
const FirstRow = ({chat, switchSidebar, isSidebarHidden}: Props) => {
    const {media, getData} = useContext(AppContext);
    const {selectChat} = useContext(SelectedChatContext);
    const {selectedServerId} = useContext(SelectedServerContext);

    const [newTitle, setNewTitle] = useState<string>();
    const [isFocused, setFocused] = useState<boolean>(false);
    const inputContainerRef = useRef<HTMLDivElement>()
    const inputRef = useRef<HTMLInputElement>()

    const [isSelectUsers, setSelectUsers] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>();

    const [isPinnedMessages, setPinnedMessages] = useState<boolean>(false);
    const pinnedMessagesRef = useRef<HTMLDivElement>();

    useEffect(() => {
        function onClick(event: any) {
            if (newTitle && inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
                setNewTitle(undefined);
                console.log("set undefined")
            }
            if (isSelectUsers && selectRef.current && !selectRef.current.contains(event.target)) {
                setSelectUsers(false);
            }
            if (isPinnedMessages && pinnedMessagesRef.current && !pinnedMessagesRef.current.contains(event.target)) {
                setPinnedMessages(false);
            }
        }

        window.addEventListener("click", onClick)
        return () => {
            window.removeEventListener("click", onClick)
        }
    }, [newTitle, isSelectUsers, isPinnedMessages])

    function onChanged(event: ChangeEvent<HTMLInputElement>) {
        event.target.style.width = '0';
        event.target.style.width = event.target.scrollWidth + 'px';
        setNewTitle(event.target.value);
    }

    const isGroupChat = "membersCount" in chat;
    const isChannel = "serverId" in chat;

    function onMouseOver() {
        if (isGroupChat)
            setNewTitle(chat.title)
    }

    function onMouseOverInput() {
        if (!inputRef.current) return;
        inputRef.current.style.width = '0';
        inputRef.current.style.width = inputRef.current.scrollWidth + 'px';
    }

    function onMouseLeave() {
        if (!isFocused)
            setNewTitle(undefined);
    }

    function onFocus() {
        setFocused(true);
    }

    function onBlur() {
        setFocused(false);
        if (newTitle && newTitle !== chat.title) {
            getData.privateChats.renameGroupChat(chat.id, newTitle);
            chat.title = newTitle;
        }
        setNewTitle(undefined);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            onBlur();
        }
    }

    function addMembers(users: string[]) {
        users.forEach(u => getData.privateChats.addMemberToGroupChat(chat.id, u))
    }

    function createDM(users: string[]) {
        if (!("userDetails" in chat)) return;
        users.push((chat.userDetails as UserDetails).id)
        getData.privateChats.createChat(users).then(id => selectChat(id));
    }

    return (
        <div className={styles.firstRow}>
            <div className={styles.infoContainer}>
                {selectedServerId === undefined ?
                    <div className={styles.iconContainer + " " + styles.roundIcon}>
                        {"image" in chat && <img
							src={media[chat.image as string] as string | undefined | null ?? undefined}
							alt={"chat's icon"}/>}
                    </div> :
                    <div className={styles.iconContainer}>
                        <img src={"icons/channel.svg"} alt={"channel"}/>
                    </div>
                }
                <div ref={inputContainerRef as any}>
                    {newTitle && !("userDetails" in chat) ?
                        <input
                            type={"text"}
                            className={csx(appStyles.customInput, styles.input)}
                            onChange={onChanged}
                            value={newTitle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onMouseOver={onMouseOverInput}
                            onKeyDown={onKeyDown}
                            ref={inputRef as any}
                            onMouseLeave={onMouseLeave}
                            maxLength={100}
                        /> :
                        <h2 onMouseOver={onMouseOver}>{chat.title}</h2>
                    }
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <div className={styles.button} ref={pinnedMessagesRef as any}
                     onClick={() => !isPinnedMessages && setPinnedMessages(true)}>
                    <img src={"icons/pin.svg"} alt={"pinned messages"}/>
                    {isPinnedMessages &&
						<PinnedMessagesPopUp close={() => setPinnedMessages(false)} chatId={chat.id}/>
                    }
                </div>
                {isChannel ||
					<div className={styles.button} ref={selectRef as any}
						 onClick={() => !isSelectUsers && setSelectUsers(true)}>
						<img src={"icons/addMember.svg"} alt={"add member"}/>
                        {isSelectUsers &&
							<SelectFriendsPopUp
								close={() => setSelectUsers(false)}
								right={true}
								buttonTitle={isGroupChat ? "Add Members" : "Create Group Chat"}
								buttonClicked={(users) =>
                                    isGroupChat ?
                                        addMembers(users) :
                                        createDM(users)
                                }
								excludeUsers={"profiles" in chat ?
                                    (chat as PrivateChatViewModel)?.profiles.map(p => p.userId) :
                                    undefined}/>
                        }
					</div>
                }
                <div className={styles.button} onClick={switchSidebar}>
                    <img src={isSidebarHidden ? "icons/sidebarShow.svg" : "icons/sidebarHide.svg"}
                         alt={"hide sidebar"}/>
                </div>
            </div>
        </div>
    );
};

export default FirstRow;