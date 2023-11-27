export interface Role {
    /** Id of the role */
    id: string;
    /** Non-unique name of the role */
    name: string | undefined;
    /** Color of the role in hex format */
    color: string | undefined;
    /** Priority that indicates how high the role is in the hierarchy */
    priority: number;
    /** Claims of the role */
    claims?: Claim[];
}
export interface Claim {
    type: string;
    value: boolean;
}