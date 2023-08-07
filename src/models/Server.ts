import Channel from "./Channel";
import Role from "./Role";
import ServerProfile from "./ServerProfile";
import User from "./User";

type Server = {
    id: number | undefined
    title: string;
    image: string | undefined;
    channels: Channel[];
    serverProfiles: ServerProfile[];
    roles: Role[];
}
export default Server;