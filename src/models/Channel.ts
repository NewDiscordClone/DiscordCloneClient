import Chat from "./Chat";

export interface Channel extends Chat{
    title: string;
    serverId: string;
    profiles?: string;
}
export default Channel;