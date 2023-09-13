/** Represents url attachment */
export interface Attachment {
    /** True if url are in the message text */
    isInText?: boolean;
    /** Attachment url */
    path: string;
    /** Flag that indicates that content in attachment is a spoiler */
    isSpoiler: boolean;
}
export default Attachment;