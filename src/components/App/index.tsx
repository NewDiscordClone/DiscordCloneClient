import React from 'react';
import styles from './App.module.scss';
import ServerIcon from "./Server/ServerIcon";
import Server from "../../models/Server";
import WorkColumn from "./WorkColumn";
import server from "../../models/Server";

const serverArray : Server[] = [
    {
        id: 1,
        title: "test 1",
        image: "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-square2-512.png",
        channels: [],
        roles: [],
        serverProfiles: []
    },
    {
        id: 2,
        title: "test 2",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/YouTube_social_red_square_%282017%29.svg/1024px-YouTube_social_red_square_%282017%29.svg.png",
        channels: [],
        roles: [],
        serverProfiles: []
    },{
        id: 3,
        title: "test 3",
        image: "https://cdn4.iconfinder.com/data/icons/miu-square-flat-social/60/whatsapp-square-social-media-512.png",
        channels: [],
        roles: [],
        serverProfiles: []
    },{
        id: 4,
        title: "test 4",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuBDIoeoNCvS8p16czXQThmrIF1a-nPzgSZg&usqp=CAU",
        channels: [],
        roles: [],
        serverProfiles: []
    },{
        id: 5,
        title: "test 5",
        image: "https://archive.org/download/discordprofilepictures/discordred.png",
        channels: [],
        roles: [],
        serverProfiles: []
    },
]
const App = () => {
    return (
        <div className={styles.container}>
            <div className={styles.serversColumn}>
                {serverArray.map(s => <ServerIcon key={s.id} server={s}/>)}
            </div>
            <div className={styles.rightColumn}>
                <WorkColumn/>
            </div>
        </div>
    );
};

export default App;