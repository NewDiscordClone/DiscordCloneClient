/** User dto for collections */
export interface UserLookUp {
    id?: string;
    /** Non-unique user name */
    displayName?: string | undefined;
    /** Avatar url */
    avatar?: string | undefined;
    textStatus?: string | undefined;
}