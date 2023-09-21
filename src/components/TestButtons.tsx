import React, {useContext, useEffect, useState} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext, SelectedChatContext} from "../Contexts";
import {messageClicked, serverClicked} from "../TestEvents";
import Message from "../models/Message";
import {InvitationDetails} from "../models/InvitationDetails";

const TestButtons = () => {
    const {user, getData} = useContext(AppContext);
    const [message, setMessage] = useState<Message>();
    const [serverId, setServerId] = useState<string>();
    const {selectedChatId} = useContext(SelectedChatContext);

    useEffect(() => {
        messageClicked.addListener(setMessage);
        serverClicked.addListener(setServerId);
        return () => {
            messageClicked.removeListener(setMessage);
            serverClicked.removeListener(setServerId);
        }
    }, [])

    function createChat() {
        const title: string | undefined = window.prompt("Type chat title", undefined) ?? undefined;
        getData.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]});
    }

    function friendRequest() {
        const username: string | null = window.prompt("Type username to send request to")
        if (!username) return;
        getData.sendFriendRequest({userName: username});
    }

    function acceptFriendRequest() {
        const userId: string | null = window.prompt("Paste UserId to accept friend request from");
        if (!userId) return;
        getData.acceptFriendRequest({userId});
    }

    function removeMessage() {
        if (!message || !message.id) {
            setMessage(undefined);
            return;
        }
        const isConfirmed = window.confirm(message.text);
        if (!isConfirmed) return;
        getData.removeMessage({messageId: message.id});
    }


    function editMessage() {
        if (!message || !message.id) {
            setMessage(undefined);
            return;
        }
        const newText = window.prompt("NewText (" + message.text + ")");
        if (!newText) return;
        getData.editMessage({messageId: message.id, newText: newText});
    }

    function getRelationships() {
        getData.getRelationships().then(rs => {
            const strings = rs.map(r => r.user?.displayName + " (" + r.user?.id + ") - " + r.relationshipType)
            strings.unshift(user?.id as string);
            const string = strings.join("\n");
            alert(string)
            console.log(string);
        });
    }

    function addMemberToChat() {
        if (!selectedChatId) return;
        const memberId = window.prompt("Paste new member Id");
        if (!memberId) return;
        getData.addMemberToGroupChat({chatId: selectedChatId, newMemberId: memberId});
    }

    function removeMemberFromChat() {
        if (!selectedChatId) return;
        const memberId = window.prompt("Paste new member Id");
        if (!memberId) return;
        getData.removeGroupChatMember({chatId: selectedChatId, memberId: memberId});
    }

    function makeChatOwner() {
        if (!selectedChatId) return;
        const memberId = window.prompt("Paste new member Id");
        if (!memberId) return;
        getData.makeGroupChatOwner({chatId: selectedChatId, memberId: memberId});
    }

    function createServer() {
        const title = window.prompt("Type the server's name");
        if (!title) return;
        getData.createServer({title, image: undefined});
    }

    function renamePrivateChat() {
        if (!selectedChatId) return;
        const newTitle = window.prompt("Type a new PrivateChat name") ?? undefined;
        getData.renameGroupChat({chatId: selectedChatId, newTitle});
    }

    function createInvitation() {
        if (!serverId) return;
        getData.invite({serverId, includeUser: true}).then(i => console.log(i));
    }

    function getInvitationDetails() {
        const invitationId = window.prompt("Paste invitation Id");
        if (!invitationId) return;
        getData.invitation(invitationId).then(invitationDetails => {
            console.log(invitationDetails)
        });
    }

    function updateServer() {
        if (!serverId) return;
        const newTitle = window.prompt("Type a new PrivateChat name") ?? undefined;
        getData.updateServer({serverId: serverId, title: newTitle});
    }

    function createChannel() {
        if (!serverId) return;
        const title = window.prompt("Type a new Channel name")
        if (!title) return;
        getData.createChannel({title, serverId});
    }

    function renameChannel() {
        if (!serverId || !selectedChatId) return;
        const newTitle = window.prompt("Type a new Channel name")
        if (!newTitle) return;
        getData.renameChannel({newTitle, chatId: selectedChatId});
    }

    function removeChannel() {
        if (!serverId || !selectedChatId) return;
        getData.removeChannel({chatId: selectedChatId});
    }

    return <div>
        <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        <hr/>
        <input onClick={() => createServer()} type='button' value={"Create server"}/>
        <input onClick={() => getInvitationDetails()} type='button' value={"Get invitation details"}/>
        {serverId ?
            <>
                <input onClick={() => createInvitation()} type='button' value={"Create Invitation"}/>
                <input onClick={() => updateServer()} type='button' value={"Update server"}/>
                <hr/>
                <input onClick={() => createChannel()} type='button' value={"Create channel"}/>
                {selectedChatId ?
                    <>
                        <input onClick={() => renameChannel()} type='button' value={"Rename channel"}/>
                        <input onClick={() => removeChannel()} type='button' value={"Remove channel"}/>
                    </>
                    : null
                }
            </>
            :
            <>
                <hr/>
                <input onClick={() => createChat()} type='button' value={"Create chat"}/>
                {selectedChatId ?
                    <>
                        <input onClick={() => addMemberToChat()} type='button' value={"Add member"}/>
                        <input onClick={() => removeMemberFromChat()} type='button' value={"Remove member"}/>
                        <input onClick={() => makeChatOwner()} type='button' value={"Make owner"}/>
                        <input onClick={() => renamePrivateChat()} type='button' value={"Rename chat"}/>
                    </>
                    : null
                }
            </>
        }
        <hr/>
        <input onClick={() => friendRequest()} type='button' value={"Friend request"}/>
        <input onClick={() => acceptFriendRequest()} type='button' value={"Accept friend"}/>
        <input onClick={() => getRelationships()} type='button' value={"Get relationships"}/>
        <hr/>
        {message ?
            <>
                <input onClick={() => removeMessage()} type='button' value={"Remove message"}/>
                <input onClick={() => editMessage()} type='button' value={"Edit message"}/>
                <hr/>
            </>
            : null
        }
    </div>
};

export default TestButtons;