import Message from "./models/Message";
import {EventP} from "./Events";
import Attachment from "./models/Attachment";

export const messageClicked = new EventP<Message>();
export const serverClicked = new EventP<string | undefined>();