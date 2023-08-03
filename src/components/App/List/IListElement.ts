interface IListElement{
    get id(): number;
    get image(): string
    get title(): string
    get subtitle(): string | null
    clickAction: (() => void) | null
    crossAction: (() => void) | null


    // get rightClickAction(): (element: IListElement) => void
}
export default IListElement;