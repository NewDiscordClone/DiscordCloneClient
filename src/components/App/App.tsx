import React, {useEffect, useState} from 'react';
import styles from './App.module.scss';
import LoadData from "./LoadData";
import ServersChats from "./ServersChats";
import ChatSpace from "./ChatSpace/ChatSpace";
import MinWidthChecker from "./MinWidthChecker";

const App = () => {

    return (
        <MinWidthChecker>
            <LoadData>
                <div className={styles.container}>
                    <ServersChats/>
                    <ChatSpace/>
                </div>
            </LoadData>
        </MinWidthChecker>
    );
};

export default App;