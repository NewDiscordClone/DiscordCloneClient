import {UserStatus} from "./UserDetails";
import PrivateChatLookUp from "./PrivateChatLookUp";

export interface PrivateChatViewModel extends PrivateChatLookUp {
    /** Unique Id as an string representation of an ObjectId type */
    id: string;
    /** Members of the chat */
    title: string;
    image?: string
    ownerId?: string;
    createdDate: string;
    updatedDate: string
    profiles: UserProfileViewModel[];
}

export interface UserProfileViewModel {
    id: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    textStatus?: string;
    status: UserStatus;
}