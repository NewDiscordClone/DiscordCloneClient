import Role from "./Role";

export interface ServerProfile {
    id?: number;
    displayName?: string | undefined;
    roles?: Role[] | undefined;
}
export default ServerProfile;