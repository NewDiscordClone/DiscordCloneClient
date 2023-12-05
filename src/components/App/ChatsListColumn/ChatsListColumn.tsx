import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext, SelectedChatContext} from "../../../Contexts";
import Chat from "../../../models/Chat";
import List from "../List/List";
import styles from "./ChatsListColumn.module.scss"
import UserSection from "./UserSection";
import SelectFriendsPopUp from "../SelectFriendsPopUp/SelectFriendsPopUp";
import IListElement from "../List/IListElement";
import PrivateChatListItem from "../List/PrivateChatListItem";
import {ContextOption} from "../ContextMenu/ContextOption";
import {ActionType} from "../reducer";
import ServerDropdown from "../Server/ServerDropdown/ServerDropdown";
import ChannelChatListItem from "../List/ChannelChatListItem";
import Modal from "../Modal/Modal";
import ChannelOverviewModal from "./ChannelOverviewModal";
import CreateChannelModal from "../Server/CreateChannelModal/CreateChannelModal";
import {RelationshipType} from "../../../models/Relationship";
import PrivateChatLookUp, {PersonalChatLookUp} from "../../../models/PrivateChatLookUp";
import {UserLookUp} from "../../../models/UserLookUp";
import Channel from "../../../models/Channel";
import PersonalChatListItem from "../List/PersonalChatListItem";


type Props = {
    chats: Chat[];
    serverId: string | undefined;
}
const ChatsListColumn = ({chats, serverId}: Props) => {
    const {getData, dispatch, relationships, users} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const [chatToChangeIcon, setChatToChangeIcon] = useState<string>();
    const [isCreateChat, setCreateChat] = useState<boolean>(false);
    const [isCreateChannel, setCreateChannel] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>();
    const [channelToEdit, setChannelToEdit] = useState<string>();

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
    }, [isCreateChat])

    function createChat() {
        if (serverId) {
            setCreateChannel(true);
        } else if (!isCreateChat) {
            setCreateChat(true);
        }
    }

    const inputRef = useRef<HTMLInputElement>();

    function setContextAction(listElement: IListElement) {
        const chatElement = listElement as PrivateChatListItem
        const channelElement = listElement as ChannelChatListItem
        const options: (ContextOption | null)[] = []
        if (chatElement.privateChat) {
            if ("membersCount" in chatElement.privateChat) {
                options.push(
                    {
                        title: "Change Icon", action: () => {
                            setChatToChangeIcon(chatElement.privateChat.id);
                            inputRef.current?.click();
                        }
                    },
                    {
                        title: "Leave Group Chat",
                        action: () => {
                            getData.privateChats.leaveFromGroupChat(chatElement.id)
                        },
                        danger: true
                    }
                )
            } else if ("userId" in chatElement.privateChat) {
                const userId = (chatElement.privateChat as PersonalChatLookUp).userId;
                const relationship = relationships
                    .find(r => r.user.id === userId)

                if (relationship) {
                    if (relationship.type === RelationshipType.Friend)
                        options.push({
                            title: "Remove Friend", action: () => {
                                getData.users.deleteFriend(userId)
                            }
                        })
                    options.push(
                        relationship.type === RelationshipType.Blocked ?
                            {
                                title: "Unblock",
                                action: () => {
                                    getData.users.unblockUser(userId)
                                },
                            } :
                            {
                                title: "Block",
                                action: () => {
                                    getData.users.blockUser(userId)
                                },
                                danger: true
                            }
                    )
                } else {
                    options.push(
                        {
                            title: "Add Friend", action: () => {
                                getData.users.sendFriendRequest(userId)
                            }
                        },
                        {
                            title: "Block",
                            action: () => {
                                getData.users.blockUser(userId)
                            },
                            danger: true
                        }
                    );
                }
            }
        } else if (channelElement.channel) {
            options.push(
                {
                    title: "Edit Overview",
                    action: () => {
                        setChannelToEdit(channelElement.id)
                    }
                },
                {
                    title: "Remove Channel",
                    action: () => {
                        getData.channels.removeChannel(channelElement.id, channelElement.serverId)
                    },
                    danger: true
                }
            )
        }
        return options.length > 0 ? options : null;
    }

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
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
            getData.media
                .uploadMedia(formData)
                .then(ids =>
                    getData.privateChats
                        .changeGroupChatImage(chatToChangeIcon as any, ids[0]));
        }
    }

    function createGroup(users: string[]) {
        getData.privateChats.createChat(users)
            .then(id => getData.privateChats.getDetails(id))
            .then(chat => {
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: {...chat, membersCount: chat.profiles.length, messages: []}
                })
                selectChat(chat.id);
            });
    }

    function tempSelectChat(chatId: string) {
        // console.log(chatId);
        selectChat(chatId);
    }

    const getListElement = (chat: Chat, clickAction: (chatId: string) => void = () => {}): IListElement => {
        let element: IListElement

        if ("serverId" in chat) {
            element = new ChannelChatListItem(chat as Channel);
        } else if ("userId" in chat){
            element = new PersonalChatListItem(chat as PersonalChatLookUp, users)
        }
        else {
            const privateChat = chat as PrivateChatLookUp;
            element = new PrivateChatListItem(privateChat);
        }
        element.clickAction = () => clickAction(element.id);
        element.isSelected = chat.id === selectedChatId;
        return element;
    }

    const pendingAmount = relationships.filter(r =>
        r.type === RelationshipType.Pending &&
        r.isActive
    ).length

    return (
        <div className={styles.chatListColumn}>
            <input type="file" style={{display: "none"}} ref={inputRef as any} onChange={handleUpload}/>
            {serverId ?
                <ServerDropdown/> :
                <div className={styles.mainTitle}>
                    <h1 className={styles.sparkleTitle}>SPARKLE</h1>
                    <div className={styles.friendsButton} onClick={() => selectChat(undefined)}>
                        <img alt={"friends"} src={"icons/friends.svg"}/>
                        <h2>FRIENDS</h2>
                        {
                            pendingAmount > 0 && selectedChatId !== undefined &&
							<div className={styles.friendRequests}>
                                {pendingAmount}
							</div>
                        }
                    </div>
                </div>
            }
            <div className={styles.listTitle}>
                <h2 style={{marginLeft: "15px"}}>{serverId ? "TEXT CHANNELS" : "PRIVATE MESSAGES"}</h2>
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
                                <SelectFriendsPopUp
                                    close={() => setCreateChat(false)}
                                    buttonTitle={"Create GroupIcon"}
                                    buttonClicked={createGroup}
                                    minAmount={2}
                                />
                            : null
                        }
                    </div>
                </div>
            </div>
            <div className={styles.list}>
                <List setContextAction={setContextAction} elements={
                    serverId ?
                        chats.map(c => getListElement(c, tempSelectChat)) :
                        [...chats]
                            .sort(
                                (c1, c2) => new Date(c2.updatedDate).getTime() - new Date(c1.updatedDate).getTime()
                            )
                            .map(c => getListElement(c, selectChat))}/>
            </div>
            <UserSection/>
            <Modal isOpen={!!channelToEdit} setOpen={() => setChannelToEdit(undefined)}>
                <ChannelOverviewModal channelId={channelToEdit as string}/>
            </Modal>
            <Modal isOpen={isCreateChannel} setOpen={setCreateChannel}>
                <CreateChannelModal/>
            </Modal>
        </div>
    );
};

export default ChatsListColumn;