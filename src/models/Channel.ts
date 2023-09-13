import Chat from "./Chat";

export interface Channel extends Chat{
    title?: string | undefined;
    serverId?: string | undefined;
}
export default Channel;