import {MutableRefObject} from "react";
import {ContextOption} from "./ContextOption";

export interface ContextMenuObject {
    contextRef: MutableRefObject<HTMLElement | undefined>;
    options: (ContextOption | null)[]
}