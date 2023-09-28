import {UserLookUp} from "./UserLookUp";

export interface Relationship {
    user: UserLookUp;
    relationshipType: RelationshipType;
}

export enum RelationshipType {
    Acquaintance = 0,
    Friend = 1,
    Pending = 2,
    Waiting = 3,
    Blocked = 4,
}