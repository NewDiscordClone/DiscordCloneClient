import Chat from "./Chat";
import {UserLookUp} from "./User";

export interface PrivateChat extends Chat {
    image: string | undefined;
    title: string | undefined;
    users: UserLookUp[];
}
export default PrivateChat;