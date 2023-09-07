export interface GroupChat {
    /** Unique Id as an string representation of an ObjectId type */
    id?: string | undefined;
    /** Members of the chat */
    users?: string[] | undefined;
    ownerId?: string;
    image?: string | undefined;
    title?: string | undefined;
}