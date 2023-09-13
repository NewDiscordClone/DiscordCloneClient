import Message from "./models/Message";
import {EventP} from "./Events";

export const messageClicked : EventP<Message> = new EventP<Message>();