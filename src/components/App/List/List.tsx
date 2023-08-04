import React from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import ListItem from "./ListItem";

const List = ({elements} : {elements: IListElement[]}) => {

    return (
        <ul className={styles.container}>
            {elements.map(e => {
                const isChannel : boolean = `channel` in e;
                return <ListItem key={e.id} element={e} isChannel={isChannel}/>
            })}
        </ul>
    );
}
export default List;