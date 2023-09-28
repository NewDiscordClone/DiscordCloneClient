import Chat from "./Chat";

export interface Channel extends Chat{
    title: string;
    serverId: string;
}
export default Channel;