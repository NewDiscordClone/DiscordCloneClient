import React from 'react';
import styles from './App.module.scss';
import LoadData from "./LoadData";
import ServersChats from "./ServersChats";
import ChatSpace from "./ChatSpace/ChatSpace";
import useMinWidthChecker from "../useMinWidthChecker";
import PhoneNotAvailable from "./PhoneNotAvailable";

const App = () => {
    const isPageNarrow = useMinWidthChecker(550)

    if(isPageNarrow){
        return <PhoneNotAvailable/>
    }
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