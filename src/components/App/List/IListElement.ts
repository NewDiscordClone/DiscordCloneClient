import {ContextOption} from "../ContextMenu/ContextOption";

interface IListElement{
    get id(): string;
    get image(): string
    get title(): string
    get subtitle(): string | undefined

    clickAction: (() => void) | null
    crossAction: (() => void) | null
    isSelected: boolean
}
export default IListElement;