import Message from "./Message";

type Chat = {
    /** Unique Id as an string representation of an ObjectId type */
    id: string;
    /** The title of the chat. */
    title: string;
    /** Members of the chat */
    users: string[];
    /** Messages of the chat saved in memory*/
    messages: Message[];
    updatedDate: string;
}
export default Chat;