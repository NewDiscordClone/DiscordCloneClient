import Channel from "./Channel";

export interface ServerLookUp {
    /** The unique identifier of the server. */
    id?: string | undefined;
    /** The title of the server. */
    title?: string | undefined;
    /** The URL of the image associated with the server. (Optional) */
    image?: string | undefined;
}
export default ServerLookUp;