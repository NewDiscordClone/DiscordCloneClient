import {UserLookUp} from "./User";

export interface Reaction {
    id: number;
    user: UserLookUp;
    emoji: string | undefined;
}
export default Reaction;