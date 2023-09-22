import Chat from "./Chat";

export interface PrivateChat extends Chat {
    /** The URL of the private chat's image. */
    image: string;
    /** The title of the private chat. */
    title: string;
    /** The subtitle of the private chat with extra information such as users count for group chat or user's status for personal chat. */
    subtitle?: string | undefined;
    usersCount?: number | undefined
}
export default PrivateChat;