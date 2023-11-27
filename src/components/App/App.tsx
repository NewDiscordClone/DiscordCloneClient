import React from 'react';
import styles from './App.module.scss';
import LoadData from "./LoadData";
import ServersChats from "./ServersChats";
import ChatSpace from "./ChatSpace/ChatSpace";
import useMinWidthChecker from "../useMinWidthChecker";
import {useNavigate} from "react-router-dom";

const App = () => {
    const navigate = useNavigate();
    useMinWidthChecker(550, () => navigate("/"))

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