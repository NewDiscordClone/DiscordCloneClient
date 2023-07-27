import Channel from "./Channel";
import Role from "./Role";
import ServerProfile from "./ServerProfile";

type Server = {
    id: number | undefined
    title: string;
    image: string;
    channels: Channel[];
    serverProfiles: ServerProfile[];
    roles: Role[];
}
export default Server;