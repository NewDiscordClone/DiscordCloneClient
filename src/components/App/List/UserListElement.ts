import IListElement from "./IListElement";
import {UserStatus} from "../../../models/UserDetails";
import {ContextOption} from "../ContextMenu/ContextOption";
import {UserLookUp} from "../../../models/UserLookUp";

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
        return this.user.displayName;
    }
    get user(): UserLookUp {
        return this.users[this.userId]
    }
    constructor(private readonly userId : string, private readonly users: {[id: string]: UserLookUp}, public readonly profileId?: string) {}

    contextActions: (ContextOption | null)[] | null = null;
}
export default UserListElement;