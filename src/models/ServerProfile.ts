import User from "./User";
import Role from "./Role";

type ServerProfile = {
    id: number | undefined
    user: User;
    displayName: string;
    roles: Role[];
}
export default ServerProfile;