

export type AttachmentSend = {
    type: AttachmentType;
    path: string;
    isSpoiler: boolean;
}
export enum AttachmentType {

}

export interface Attachment {
    id: number;
    type: number;
    path: string | undefined;
    isSpoiler: boolean;
}
export default Attachment;