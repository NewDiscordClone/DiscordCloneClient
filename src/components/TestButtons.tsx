import React, {useContext, useEffect, useState} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext, SelectedChatContext} from "../Contexts";
import {messageClicked, serverClicked} from "../TestEvents";
import Message from "../models/Message";
import {InvitationDetails} from "../models/InvitationDetails";
import {flushSync} from "react-dom";

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

    function copyToken() {
        const token = localStorage.getItem('token')
        if(token)
            navigator.clipboard.writeText(token);
        else
            alert("Token is not in local storage")
    };

    function createChat() {
        const title: string | undefined = window.prompt("Type chat title", undefined) ?? undefined;
        getData.privateChats.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]});
    }

    function removeMessage() {
        if (!message || !message.id) {
            setMessage(undefined);
            return;
        }
        const isConfirmed = window.confirm(message.text);
        if (!isConfirmed) return;
        getData.messages.removeMessage(message.id, message.chatId);
    }


    function editMessage() {
        if (!message || !message.id) {
            setMessage(undefined);
            return;
        }
        const newText = window.prompt("NewText (" + message.text + ")");
        if (!newText) return;
        getData.messages.editMessage(message.id, message.chatId, newText);
    }

    function getRelationships() {
        getData.users.getRelationships().then(rs => {
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
        getData.privateChats.addMemberToGroupChat(selectedChatId, memberId);
    }

    function removeMemberFromChat() {
        if (!selectedChatId) return;
        const memberId = window.prompt("Paste new member Id");
        if (!memberId) return;
        getData.privateChats.removeGroupChatMember(selectedChatId, {memberId: memberId, silent: false});
    }

    function makeChatOwner() {
        if (!selectedChatId) return;
        const memberId = window.prompt("Paste new member Id");
        if (!memberId) return;
        getData.privateChats.changeGroupChatOwner(selectedChatId, memberId);
    }

    function createServer() {
        const title = window.prompt("Type the server's name");
        if (!title) return;
        getData.servers.createServer({title, image: undefined});
    }

    function renamePrivateChat() {
        if (!selectedChatId) return;
        const newTitle = window.prompt("Type a new PrivateChat name") ?? undefined;
        if(newTitle)
            getData.privateChats.renameGroupChat(selectedChatId, newTitle);
    }

    function createInvitation() {
        if (!serverId) return;
        getData.invitations.invite(serverId, {includeUser: true}).then(i => console.log(i));
    }

    function getInvitationDetails() {
        const invitationId = window.prompt("Paste invitation Id");
        if (!invitationId) return;
        getData.invitations.getInvitation(invitationId).then(invitationDetails => {
            console.log(invitationDetails)
        });
    }

    function updateServer() {
        if (!serverId) return;
        const newTitle = window.prompt("Type a new PrivateChat name") ?? undefined;
        getData.servers.updateServer(serverId, {title: newTitle});
    }

    function createChannel() {
        if (!serverId) return;
        const title = window.prompt("Type a new Channel name")
        if (!title) return;
        getData.channels.createChannel(serverId, title);
    }

    function renameChannel() {
        if (!serverId || !selectedChatId) return;
        const newTitle = window.prompt("Type a new Channel name")
        if (!newTitle) return;
        getData.channels.renameChannel(selectedChatId, newTitle, serverId);
    }

    function removeChannel() {
        if (!serverId || !selectedChatId) return;
        getData.channels.removeChannel(selectedChatId, serverId);
    }

    return <div>
        <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        <input onClick={() => copyToken()} type='button' value={"Copy token"}/>
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