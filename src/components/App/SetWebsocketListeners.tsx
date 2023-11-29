import React, {useContext, useEffect, useRef, useState} from "react";
import {AppContext, SelectedChatContext, SelectedServerContext} from "../../Contexts";
import ChatWebsocketService, {ClientMethod} from "../../ChatWebSocketService";
import PrivateChatLookUp from "../../models/PrivateChatLookUp";
import {ActionType} from "./reducer";
import Message from "../../models/Message";
import Channel from "../../models/Channel";
import {UserLookUp} from "../../models/UserLookUp";
import {useSaveMedia} from "./useSaveMedia";
import {Role} from "../../models/Role";
import {Relationship, RelationshipType} from "../../models/Relationship";

function useOnMessageAdded(): (newMessage: Message & { serverId: string | undefined }) => void {
    const {dispatch} = useContext(AppContext);
    const [newMessage, setNewMessage] = useState<Message & { serverId: string | undefined }>()
    const messageToLoad: Message[] | undefined = newMessage ? [newMessage] : undefined;
    // console.log("save Media");
    // console.log(messageToLoad);
    const isLoaded = useSaveMedia(messageToLoad);

    useEffect(() => {
        // console.log("is Loaded changed");
        // console.log(newMessage);
        // console.log(isLoaded);
        if (newMessage !== undefined && isLoaded) {
            dispatch({type: ActionType.AddMessage, value: newMessage})
            setNewMessage(undefined);
        }
    }, [isLoaded])

    return setNewMessage;
}

function usePageVisibility(): boolean {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = (visibility: boolean) => {
            setIsVisible(visibility);
        };

        document.addEventListener('mouseover', () => handleVisibilityChange(true));
        document.addEventListener('mouseleave', () => handleVisibilityChange(false));

        return () => {
            document.removeEventListener('mouseover', () => handleVisibilityChange(true));
            document.removeEventListener('mouseleave', () => handleVisibilityChange(false));
        };
    }, []);

    return isVisible;
}

const SetWebsocketListeners = () => {
    const {getData, dispatch, user, servers, chats} = useContext(AppContext);
    const {selectedChatId, selectChat} = useContext(SelectedChatContext);
    const {selectedServerId, selectServer} = useContext(SelectedServerContext);
    const [websocket, setWebSocket] = useState<ChatWebsocketService>();
    const setNewMessage = useOnMessageAdded();
    const isVisible = usePageVisibility();
    const notificationRef = useRef<HTMLAudioElement>();

    useEffect(() => {
        setWebSocket(new ChatWebsocketService());
        return () => {
            websocket?.disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) //НЕ МІНЯТИ!!!

    useEffect(() => {
        if (!notificationRef.current) return;
        notificationRef.current.volume = 0.4;
    }, [notificationRef])

    if (selectedChatId && isVisible && chats[selectedChatId]?.unreadMessagesCount > 0)
        dispatch(
            {
                type: ActionType.SetUnreadMessageCount,
                value: {id: selectedChatId, unreadMessagesCount: 0}//TODO: Temporary solution
            }
        )

    useEffect(() => {
        function disconnect(e: BeforeUnloadEvent) {
            websocket?.disconnect();
            return null;
        }

        if (websocket) {
            window.addEventListener("beforeunload", disconnect);
            websocket.addListener(ClientMethod.MessageAdded, (m: Message & { serverId: string | undefined }) => {
                if ("profiles" in chats[m.chatId])
                    setNewMessage(m)
                if (m.author?.id !== user.id && (!isVisible || selectedChatId !== m.chatId)) {
                    dispatch({
                        type: ActionType.SetUnreadMessageCount,
                        value: {id: m.chatId, unreadMessagesCount: chats[m.chatId].unreadMessagesCount + 1}
                    })
                    if (notificationRef.current) {
                        notificationRef.current.pause();
                        notificationRef.current.currentTime = 0;
                        notificationRef.current.play().catch(() => {});
                    }
                }
            });
            websocket.addListener(ClientMethod.ChannelCreated, (c: Channel) =>
                dispatch({
                    type: ActionType.ChannelCreated,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelUpdated, (c: Channel) =>
                dispatch({
                    type: ActionType.ChannelUpdated,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelDeleted, (c: any) =>
                dispatch({
                    type: ActionType.ChannelRemoved,
                    value: c
                }));
            websocket.addListener(ClientMethod.ChannelDeleted, ({serverId, channelId}) => {
                if (selectedChatId === channelId) selectChat(undefined);
                const server = servers[serverId]
                if (server && server.selectedChannel === channelId) dispatch({
                        type: ActionType.SaveChannel,
                        value: {selectedChannel: undefined, id: server.id as string}
                    }
                )
            });
            websocket.addListener(ClientMethod.UserUpdated, (userLookUp: UserLookUp) => {
                console.log("UpdateUser: " + userLookUp.displayName)
                if (userLookUp.id !== user?.id) {
                    console.log(userLookUp)
                    dispatch({
                        type: ActionType.UpdateUser,
                        value: userLookUp
                    });
                } else {
                    getData.users.getUser().then(u => dispatch({
                        type: ActionType.UpdateSelf,
                        value: u
                    }));
                }
            })
            websocket.addListener(ClientMethod.RelationshipsUpdated, (relationship: Relationship) => {
                    if (relationship.type === RelationshipType.Pending &&
                        relationship.isActive && notificationRef.current) {
                        notificationRef.current.pause();
                        notificationRef.current.currentTime = 0;
                        notificationRef.current.play().catch(() => {});
                    }

                    dispatch({
                        type: ActionType.UpdateRelationship,
                        value: relationship
                    })
                }
            )
            websocket.addListener(ClientMethod.RelationshipsDeleted, ({user}) =>
                dispatch({
                    type: ActionType.DeleteRelationship,
                    value: user
                })
            )
            websocket.addListener(ClientMethod.PrivateChatSaved, (c: PrivateChatLookUp) =>
                dispatch({
                    type: ActionType.PrivateChatSaved,
                    value: c
                })
            );
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) =>
                dispatch({
                    type: ActionType.PrivateChatRemoved,
                    value: chatId
                }));
            websocket.addListener(ClientMethod.PrivateChatRemoved, (chatId: string) => {
                if (selectedChatId === chatId) selectChat(undefined);
            });
            websocket.addListener(ClientMethod.MessageDeleted, (m: any) =>
                dispatch({type: ActionType.RemoveMessage, value: m}));
            websocket.addListener(ClientMethod.MessageUpdated, (m: any) =>
                dispatch({type: ActionType.MessageUpdated, value: m}));

            websocket.addListener(ClientMethod.ProfileSaved, (p: any) => {
                console.log(p)
                dispatch({type: ActionType.ServerProfileSaved, value: p})
            })

            websocket.addListener(ClientMethod.ProfileDeleted, (p: any) =>
                dispatch({type: ActionType.ServerProfileRemoved, value: p}))

            websocket.addListener(ClientMethod.ServerUpdated, (s: any) =>
                dispatch({type: ActionType.ServerDetails, value: s}))

            websocket.addListener(ClientMethod.ServerDeleted, (serverId: string) => {
                if (selectedServerId === serverId)
                    selectServer(undefined);
                dispatch({type: ActionType.ServerDeleted, value: serverId})
            })

            websocket.addListener(ClientMethod.RoleSaved, (role: Role & { serverId: string }) => {
                dispatch({type: ActionType.SaveRole, value: role});
            })
            websocket.addListener(ClientMethod.RoleDeleted, (role: Role & { serverId: string }) => {
                dispatch({type: ActionType.DeleteRole, value: role})
            })
            return () => {
                websocket.removeAllListeners();
                window.removeEventListener("beforeunload", disconnect);
            }
        }
    }, [dispatch, getData.users, selectChat, selectedChatId, servers, user?.id, websocket])
    return (
        <>
            <audio style={{display: "none"}} ref={notificationRef as any} src={"message-notification.mp3"}/>
        </>
    );
}
export default SetWebsocketListeners;