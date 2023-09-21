import {UserLookUp} from "./UserLookUp";
import {RelationshipType} from "../api/GetServerData";

export interface Relationship {
    user: UserLookUp;
    relationshipType: RelationshipType;
}