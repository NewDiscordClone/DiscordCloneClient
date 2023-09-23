import {UserStatus} from "../api/GetServerData";

export interface UserDetails{
    /** Unique user identifier. */
    id: string;
    /** Non-unique display name shown to other users. */
    displayName: string | undefined;
    /** Unique username for the user. */
    username: string;
    /** Avatar URL of the user. */
    avatar: string | undefined;
    status?: UserStatus;
    /** User's current text status message. */
    textStatus?: string | undefined;
    serverProfile?: ServerProfileDto;
}

export interface RolesDto {
    /** The unique identifier for the role. */
    id?: string;
    /** The name of the role. */
    name?: string | undefined;
    /** The color associated with the role in hexadecimal format (e.g., "#FF0000" for red). */
    color?: string | undefined;
}

export interface ServerProfileDto {
    /** User's username displayed on this server. */
    displayName?: string | undefined;
    /** List of user's roles on this server. */
    roles?: RolesDto[] | undefined;
}