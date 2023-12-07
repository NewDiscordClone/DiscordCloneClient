import IListElement from "./IListElement";
import {UserDetails, UserStatus} from "../../../models/UserDetails";
import {ContextOption} from "../ContextMenu/ContextOption";
import {UserLookUp} from "../../../models/UserLookUp";
import {ServerProfileLookup} from "../../../models/ServerProfileLookup";

class UserListElement implements IListElement {
    clickAction: (() => void) | null = null;
    crossAction: (() => void) | null = null;
    isSelected: boolean = false;

    get id(): string {
        return this.user.id;
    }

    get image(): string {
        return this.user.avatar as string;
    }

    get subtitle(): string | undefined {
        let textStatus = this.user.textStatus
        if(!textStatus)
            switch (this.user.status) {
                case UserStatus.Online:
                    textStatus = "ONLINE"
                    break;
                case UserStatus.Idle:
                    textStatus = "IDLE"
                    break;
                case UserStatus.DoNotDisturb:
                    textStatus = "DO NOT DISTURB"
                    break;
                case UserStatus.Offline:
                    textStatus = "OFFLINE"
                    break;
                default:
                    break;
            }
        return textStatus;
    }

    get title(): string {
        return this.profile?.displayName ?? this.profile?.name ?? this.user.displayName ?? (this.user as UserDetails)?.username;
    }
    get color(): string | undefined {
        return this.profile?.mainRole?.color ?? undefined;
    }
    get user(): UserLookUp {
        return this.users[this.userId]
    }
    get profile(): ServerProfileLookup | undefined {
        return this.profiles && this.profileId? this.profiles[this.profileId] : undefined;
    }
    constructor(private readonly userId : string, private readonly users: {[id: string]: UserLookUp}, public readonly profileId?: string, public readonly profiles?: {[id: string]: ServerProfileLookup}) {}

    contextActions: (ContextOption | null)[] | null = null;
}
export default UserListElement;