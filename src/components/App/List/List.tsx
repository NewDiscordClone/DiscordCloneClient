import React, {MutableRefObject, ReactNode} from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import ListItem from "./ListItem";

type Props = {
    elements: IListElement[]
    children?: (element: IListElement, ref: MutableRefObject<HTMLLIElement | undefined>) => ReactNode
}
const List = ({elements, children} : Props) => {

    return (
        <ul className={styles.container}>
            {elements.map(e => {
                const isChannel : boolean = `channel` in e;
                return <ListItem key={e.id} element={e} isChannel={isChannel} addContent={children}/>
            })}
        </ul>
    );
}
export default List;