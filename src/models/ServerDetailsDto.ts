import Channel from "./Channel";
import ServerLookUp from "./ServerLookUp";
import {Role} from "./Role";

export interface ServerDetailsDto extends ServerLookUp{
    /** The unique identifier for the server. */
    id: string;
    /** The non-unique title of the server. */
    title: string;
    /** The URL of the server's image. */
    image?: string;
    /** List of user profiles on this server. */
    serverProfiles: string[];
    /** List of channels on this server. (Not mapped to the database.) */
    channels: Channel[];
    roles: Role[] | undefined;
}
export default ServerDetailsDto;