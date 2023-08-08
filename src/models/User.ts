import ServerProfile from "./ServerProfile";

export enum UserStatus {
    online = 0,
    idle = 1,
    doNotDisturb = 2,
    offline = 3,
}

export interface UserLookUp {
    id: number;
    displayName: string;
    avatarPath: string;
}

export interface User {
    id: number;
    displayName: string;
    username: string;
    avatarPath: string;
    status: UserStatus;
    textStatus?: string | undefined;
    profile?: ServerProfile;
}
export default User;