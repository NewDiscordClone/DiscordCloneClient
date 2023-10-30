import Message from "./Message";
import {SaveAttachments} from "../components/App/reducer";

type Chat = {
    /** Unique Id as an string representation of an ObjectId type */
    id: string;
    /** The title of the chat. */
    title: string;
    /** Messages of the chat saved in memory*/
    messages: (Message & SaveAttachments)[];
    updatedDate: string;
}
export default Chat;