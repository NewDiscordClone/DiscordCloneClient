import React from 'react';
import UserInfo from "./UserInfo";
import {UserDetails, UserStatus} from "../../../models/UserDetails";
import ContextMenuProvider from "../ContextMenu/ContextMenuProvider";

const UserInfoTest = () => {
    const user: UserDetails = {
        id: "1",
        username: "artcrafter2999",
        displayName: "Art",
        avatar: undefined,
        // avatar: "https://images.ctfassets.net/dkgr2j75jrom/6oFoMY1mW7u3HubDb4s7HX/0abcca7d1bb600bfe04b3836f804e9c8/fs-blog-header-user-retention-min__1_.jpg",
        status: UserStatus.Online,
        textStatus: "I am good",
        aboutMe: "I am a programmer, I like to play D&D and other games as well",
        serverProfile: {
            id: "1",
            name: "Phipl",
            roles: [
                {
                    id: "1",
                    name: "admin",
                    color: "#FF0000",
                    priority: 1
                },
                {
                    id: "2",
                    name: "Дельфін",
                    color: "#00FF00",
                    priority: 2
                },
                {
                    id: "3",
                    name: "new role 2",
                    color: "#0000EE",
                    priority: 3
                },
                {
                    id: "4",
                    name: "SERVER-OWNER",
                    color: "#FF0000",
                    priority: 4
                }
            ]
        }
    }
    return (
        <ContextMenuProvider>
            <UserInfo userDetails={user}/>
        </ContextMenuProvider>
    );
};

export default UserInfoTest;