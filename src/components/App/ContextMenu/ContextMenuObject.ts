import {ContextOption} from "./ContextOption";

export interface ContextMenuObject {
    id: string
    options: (ContextOption | null)[]
}