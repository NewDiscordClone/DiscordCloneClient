import React, {useContext, useEffect, useState} from 'react';
import styles from './App.module.scss';
import ServerIcon from "./Server/ServerIcon";
import Server from "../../models/Server";
import WorkColumn from "./WorkColumn";
import server from "../../models/Server";
import IGetData from "../../api/IGetData";
import GetHardCodeData from "../../api/GetHardCodeData";
import ServerColumn from "./Server/ServerColumn";
import {GetDataContext} from "../../Contexts";

const App = () => {
    const [getData, setGetData] = useState<IGetData>()

    useEffect(() => {
        setGetData(new GetHardCodeData()) //TODO: Замінити клас на той, який підключається до серверу
    }, [])
    if(getData == undefined) return <div/>;
    return (
        <GetDataContext.Provider value={getData}>
            <div className={styles.container}>
                <ServerColumn/>
                <WorkColumn/>
            </div>
        </GetDataContext.Provider>
    );
};

export default App;