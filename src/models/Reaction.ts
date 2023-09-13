/** Represents emoji reaction under the message */
export interface Reaction {
    /** Emoji code */
    emoji?: string | undefined;
    /** Reaction author ID */
    user?: string;
}