import {ContextOption} from "./ContextOption";

export interface ContextMenuShowParams{
    x: number,
    y: number,
    options: (ContextOption | null)[]
}