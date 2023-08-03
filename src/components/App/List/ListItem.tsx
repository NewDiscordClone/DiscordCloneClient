import React from 'react';
import styles from "./List.module.scss"
import PrivateChat from "../../../models/PrivateChat";
import IListElement from "./IListElement";
const ListItem = ({element}:{element:IListElement}) => {
    return (
        <li className={styles.component} onClick={() => element.clickAction != null && element.clickAction()}>
            <div className={styles.iconContainer}>
                <img src={element.image}/>
            </div>
            <div className={styles.text}>
                <div>
                    <strong>{element.title}</strong>
                </div>
                <div>
                    <span>{element.subtitle}</span>
                </div>
            </div>
        </li>
    );
};

export default ListItem;
