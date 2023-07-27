export enum UserStatus {
    online,
    idle,
    doNotDisturb,
    offline
}

type User = {
    id: number | undefined
    displayName: string;
    username: string;
    avatarPath: string;
    status: UserStatus;
    textStatus: string | null;
}
export default User;