import {Role} from "./Role";
import {RoleDto, UserStatus} from "./UserDetails";

export interface ServerProfileLookup {
    id: string;
    userId: string;
    avatarUrl: string | undefined;
    textStatus: string | undefined;
    status: UserStatus;
    name: string;
    mainRole: Role;
    roles?: RoleDto[];
}