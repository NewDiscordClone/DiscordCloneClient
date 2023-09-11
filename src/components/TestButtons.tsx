import React, {useContext} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext} from "../Contexts";
import styles from "./App/Server/Server.module.scss";

const TestButtons = () => {
    const {user,getData} = useContext(AppContext);
    const createChatHandler = () => {
        const title: string | undefined = window.prompt("Type chat title", undefined) ?? undefined;
        getData.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]});
    }

    const friendRequest = () => {
        const username: string | null = window.prompt("Type username to send request to")
        if(!username) return;
        getData.sendFriendRequest({userName: username});
    }

    function acceptFriendRequest() {
        const userId: string | null = window.prompt("Paste UserId to accept friend request from");
        if(!userId) return;
        getData.acceptFriendRequest({userId});
    }

    return <div className={styles.testInputs}>
        <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        <input onClick={() => createChatHandler()} type='button' value={"Create chat"}/>
        <input onClick={() => friendRequest()} type='button' value={"Friend request"}/>
        <input onClick={() => acceptFriendRequest()} type='button' value={"Accept friend"}/>
    </div>
};

export default TestButtons;