import {Role} from "./Role";

export interface ServerProfileLookup {
    id: string;
    name: string;
    userId: string;
    mainRole: Role;
}