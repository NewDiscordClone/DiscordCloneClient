import Message from "./Message";

type Chat = {
    chatId: number | undefined;
    messages: Message[];
}
export default Chat;