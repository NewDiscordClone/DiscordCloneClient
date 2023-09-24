import IListElement from "./IListElement";
import {UserLookUp} from "../../../models/UserLookUp";
import {UserStatus} from "../../../models/UserDetails";

class UserListElement implements IListElement {
    clickAction: (() => void) | null = null; //TODO: Відкрити меню вибору статусу
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
    constructor(private user : UserLookUp) {}
}
export default UserListElement;