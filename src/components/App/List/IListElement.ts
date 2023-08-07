interface IListElement{
    get id(): number;
    get image(): string
    get title(): string
    get subtitle(): string | undefined
    clickAction: (() => void) | null
    crossAction: (() => void) | null
    isSelected: boolean
    // get rightClickAction(): (element: IListElement) => void
}
export default IListElement;