export interface GroupChat {
    /** Unique Id as an string representation of an ObjectId type */
    id: string;
    /** Members of the chat */
    profiles: string[];
    ownerId?: string;
    image?: string | undefined;
    title?: string | undefined;
}