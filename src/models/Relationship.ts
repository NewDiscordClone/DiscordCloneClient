import {UserLookUp} from "./UserLookUp";

export interface Relationship {
    isActive: boolean;
    user: UserLookUp & { userName: string };
    type: RelationshipType;
}

export enum RelationshipType {
    Acquaintance,
    Friend,
    Pending,
    Blocked
}