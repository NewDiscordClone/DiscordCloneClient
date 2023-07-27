import User from "./User";

type Reaction = {
    id: number | undefined;
    user: User;
    emoji: string;
}
export default Reaction;