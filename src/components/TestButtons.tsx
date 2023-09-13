import React, {useContext, useEffect, useState} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext, SelectedChatContext} from "../Contexts";
import {messageClicked} from "../TestEvents";
import Message from "../models/Message";

const TestButtons = () => {
    const {user, getData} = useContext(AppContext);
    const [message, setMessage] = useState<Message>();
    const {selectedChatId} = useContext(SelectedChatContext);

    useEffect(() => {
        messageClicked.addListener(setMessage)
        return () => {
            messageClicked.removeListener(setMessage)
        }
    }, [])

    function createChatHandler() {
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

    return <div>
        <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        <hr/>
        <input onClick={() => createChatHandler()} type='button' value={"Create chat"}/>
        {selectedChatId ?
            <>
                <input onClick={() => addMemberToChat()} type='button' value={"Add member"}/>
                <input onClick={() => removeMemberFromChat()} type='button' value={"Remove member"}/>
                <input onClick={() => makeChatOwner()} type='button' value={"Make owner"}/>
            </>
            : null
        }
        <hr/>
        <input onClick={() => friendRequest()} type='button' value={"Friend request"}/>
        <input onClick={() => acceptFriendRequest()} type='button' value={"Accept friend"}/>
        <input onClick={() => getRelationships()} type='button' value={"Get relationships"}/>
        {message ?
            <>
                <hr/>
                <input onClick={() => removeMessage()} type='button' value={"Remove message"}/>
                <input onClick={() => editMessage()} type='button' value={"Edit message"}/>
                <hr/>
            </>
            : null
        }
    </div>
};

export default TestButtons;