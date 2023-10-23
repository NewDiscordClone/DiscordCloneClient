import React, {useContext, useEffect, useState} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext, SelectedChatContext} from "../Contexts";
import {messageClicked} from "../TestEvents";
import Message from "../models/Message";

const TestButtons = ({serverId}: { serverId: string | undefined }) => {
    const {user, getData} = useContext(AppContext);
    const [message, setMessage] = useState<Message>();
    const {selectedChatId} = useContext(SelectedChatContext);

    useEffect(() => {
        messageClicked.addListener(setMessage);
        return () => {
            messageClicked.removeListener(setMessage);
        }
    }, [])

    function copyToken() {
        const token = localStorage.getItem('token')
        if (token)
            navigator.clipboard.writeText(token);
        else
            alert("Token is not in local storage")
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
            const strings = rs.map(r => r.user?.displayName + " (" + r.user?.id + ") - " + r.type)
            strings.unshift(user?.id as string);
            const string = strings.join("\n");
            // alert(string)
            console.log(string);
        });
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
        <input onClick={() => getInvitationDetails()} type='button' value={"Get invitation details"}/>
        {serverId &&
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
        }
        <hr/>
        <input onClick={() => getRelationships()} type='button' value={"Get relationships"}/>
    </div>
};

export default TestButtons;