import React, {MutableRefObject, ReactNode} from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import ListItem from "./ListItem";
import {ContextOption} from "../ContextMenu/ContextOption";

type Props = {
    elements: IListElement[]
    children?: (element: IListElement, ref: MutableRefObject<HTMLLIElement | undefined>) => ReactNode
    setContextAction?: (element: IListElement) => (ContextOption | null)[] | null
}
const List = ({elements, children, setContextAction}: Props) => {
    return (
        <ul className={styles.container}>
            {elements.map(e => {
                const isChannel: boolean = `channel` in e;
                return <ListItem
                    key={e.id}
                    element={e}
                    isChannel={isChannel}
                    addContent={children}
                    setContextAction={setContextAction}
                />
            })}
        </ul>
    );
}
export default List;