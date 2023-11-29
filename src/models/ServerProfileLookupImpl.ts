import {ServerProfileLookup} from "./ServerProfileLookup";
import {Role} from "./Role";
import {RoleDto, UserStatus} from "./UserDetails";
import {UserLookUp} from "./UserLookUp";

class ServerProfileLookupImpl implements ServerProfileLookup {
    id: string;
    userId: string;
    name: string;
    serverId: string | undefined;
    mainRole: Role;
    roles?: RoleDto[];

    get avatarUrl(): string | undefined {
        return this.users[this.userId].avatar
    }

    get status(): UserStatus {
        return this.users[this.userId].status as UserStatus;
    }

    get textStatus(): string | undefined {
        return this.users[this.userId].textStatus;
    }

    constructor(profile: ServerProfileLookup, private users: { [id: string]: UserLookUp }) {
        this.id = profile.id;
        this.userId = profile.userId;
        this.name = profile.name;
        this.mainRole = profile.mainRole;
        this.roles = profile.roles;
        this.serverId = profile.serverId;
        if(!this.mainRole && this.roles){
            this.mainRole = [...this.roles].sort((r1, r2) => r2.priority - r1.priority)[0];
        }
    }
}
export default ServerProfileLookupImpl;