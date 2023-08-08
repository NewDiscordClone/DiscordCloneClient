import Channel from "./Channel";

export interface ServerLookUp {
    id?: number;
    title?: string | undefined;
    image?: string | undefined;
    channels: Channel[]
}
export default ServerLookUp;