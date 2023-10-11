import React from 'react';
import styles from './App.module.scss';
import LoadData from "./LoadData";
import ServersChats from "./ServersChats";
import ChatSpace from "./ChatSpace/ChatSpace";

const App = () => {
    return (
        <LoadData>
            <div className={styles.container}>
                <ServersChats/>
                <ChatSpace/>
            </div>
        </LoadData>
    );
};

export default App;