

export type AttachmentSend = {
    type: AttachmentType;
    path: string;
    isSpoiler: boolean;
}
export enum AttachmentType {

}

type Attachment = {
    id: number | undefined;
    type: AttachmentType;
    path: string;
    isSpoiler: boolean;
}
export default Attachment;