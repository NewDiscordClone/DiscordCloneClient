import React from 'react';
import styles from './App.module.scss';
import LoadData from "./LoadData";
import ServersChats from "./ServersChats";
import ChatSpace from "./ChatSpace/ChatSpace";
import InfoColumn from "./InfoColumn/InfoColumn";

const App = () => {
    return (
        <LoadData>
            <div className={styles.container}>
                <ServersChats/>
                <ChatSpace/>
                <InfoColumn/>
            </div>
        </LoadData>
    );
};

export default App;