import Message from "./Message";

type Chat = {
    /** Unique Id as an string representation of an ObjectId type */
    id: string;
    /** The title of the chat. */
    title: string;
    /** Messages of the chat saved in memory*/
    messages: Message[];
    updatedDate: string;
}
export default Chat;