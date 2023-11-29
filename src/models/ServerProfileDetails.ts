import {Role} from "./Role";
import {UserStatus} from "./UserDetails";

export interface ServerProfileDetails {
    id: string;
    userId: string;
    avatarUrl: string | undefined;
    textStatus: string | undefined;
    status: UserStatus;
    name: string;
    roles: Role[];
    serverId?: string;
}