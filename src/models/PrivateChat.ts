import Chat from "./Chat";

export interface PrivateChat extends Chat {
    /** The URL of the private chat's image. */
    image: string;
    membersCount: number;
}
export default PrivateChat;