import Channel from "./Channel";
import ServerLookUp from "./ServerLookUp";

export interface ServerDetailsDto extends ServerLookUp{
    /** The unique identifier for the server. */
    id?: string | undefined;
    /** The non-unique title of the server. */
    title?: string | undefined;
    /** The URL of the server's image. */
    image?: string | undefined;
    /** List of user profiles on this server. */
    serverProfiles?: ServerProfileLookupDto[] | undefined;
    /** List of channels on this server. (Not mapped to the database.) */
    channels: Channel[];
    /** List of roles on this server. */
    roles?: RoleDto[] | undefined;
}
export interface ServerProfileLookupDto {
    /** Non-unique name of user on this server */
    displayName?: string | undefined;
    /** Unique id of the user */
    userId?: string;
    mainRole?: RoleDto;
}
export interface RoleDto {
    /** The unique identifier for the role. */
    id?: string;
    /** The name of the role. */
    name?: string | undefined;
    /** The color associated with the role in hexadecimal format (e.g., "#FF0000" for red). */
    color?: string | undefined;
}