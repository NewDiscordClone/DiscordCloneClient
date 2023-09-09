import React, {useContext} from 'react';
import {signoutRedirect} from "../auth/user-service";
import {AppContext} from "../Contexts";
import styles from "./App/Server/Server.module.scss";

const TestButtons = () => {
    const {user,getData} = useContext(AppContext);
    const createChatHandler = () => {
        const title: string | undefined = window.prompt("Type chat title") ?? undefined;
        getData.createGroupChat({title: title, image: undefined, usersId: [user?.id as string]})
    }

    return <div className={styles.testInputs}>
        <input onClick={() => signoutRedirect()} type='button' value={"Sign out"}/>
        <input onClick={() => createChatHandler()} type='button' value={"Create chat"}/>
    </div>
};

export default TestButtons;