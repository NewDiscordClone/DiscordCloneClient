import {UserLookUp} from "./UserLookUp";
import {ServerLookUp} from "./ServerLookUp";

export interface InvitationDetails {
    /** The unique identifier of the invitation. */
    id: string;
    user?: UserLookUp;
    server: ServerLookUp;
    /** The expiration time of the invitation. (Optional) */
    expireTime?: Date | undefined;
}