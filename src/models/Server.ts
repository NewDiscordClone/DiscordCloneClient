import Channel from "./Channel";
import Role from "./Role";
import ServerProfile from "./ServerProfile";
import User from "./User";

type Server = {
    id: number | undefined
    title: string;
    image: string;
    channels: Channel[];
    serverProfiles: ServerProfile[];
    roles: Role[];
    users: User[];
}
export default Server;