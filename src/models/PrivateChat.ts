import Chat from "./Chat";
import User from "./User";

type PrivateChat = Chat & {
    id: number | undefined;
    image: string | null;
    title: string | null;
    users: User[];
}
export default PrivateChat;