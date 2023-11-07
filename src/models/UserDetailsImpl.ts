import {ServerProfileDto, UserDetails, UserStatus} from "./UserDetails";

class UserDetailsImpl implements UserDetails{
    id: string;
    username: string;
    get displayName(): string {
        return this.details.displayName ?? this.username
    }
    avatar: string | undefined;
    status?: UserStatus;
    textStatus: string | undefined;
    aboutMe: string | undefined;
    serverProfile?: ServerProfileDto;
    constructor(private details: UserDetails) {
        this.id = details.id;
        this.username = details.username;
        this.avatar = details.avatar;
        this.status = details.status;
        this.textStatus = details.textStatus;
        this.aboutMe = details.aboutMe;
        this.serverProfile = details.serverProfile;
    }
}
export default UserDetailsImpl