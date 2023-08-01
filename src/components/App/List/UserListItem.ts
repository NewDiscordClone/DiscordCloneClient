import IListElement from "./IListElement";
import User from "../../../models/User";

class UserListItem implements IListElement {
    get id(): number {
        return <number>this._user.id;
    }
    get image(): string {
        return this._user.avatarPath;
    }
    get title(): string {
        return this._user.displayName;
    }
    get subtitle(): string | null {
        return this._user.textStatus;
    }

    clickAction : (() => void) | null = null;
    crossAction : (() => void) | null = null;

    private _user : User;


    constructor(user: User) {
        this._user = user;
    }
}
export default UserListItem;