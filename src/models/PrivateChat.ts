import Chat from "./Chat";
import User from "./User";

type PrivateChat = Chat & {
    image: string | undefined;
    title: string | undefined;
    users: User[];
}
export default PrivateChat;