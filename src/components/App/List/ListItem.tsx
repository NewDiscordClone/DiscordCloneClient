import React from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import csx from "classnames";

const ListItem = ({element, isChannel = false}: { element: IListElement, isChannel?: boolean }) => {
    return (
        <li className={csx(styles.component, {[styles.channel]: isChannel, [styles.selected]: element.isSelected})}
            onClick={() => element.clickAction != null && element.clickAction()}>
            {
                isChannel ?
                    <div className={styles.svgIconContainer}>
                        <img className={styles.svgIconContainer} src={"icons/channel.svg"} alt={"channel icon"}/>
                    </div>
                    :
                    <div className={styles.iconContainer}>
                        <img src={element.image} alt={"chatImage"}/>
                    </div>
            }
            <div className={csx(styles.content, {[styles.channelText]: isChannel})}>
                <strong>{element.title}</strong>
                {isChannel ||
					<div>
						<span>{element.subtitle}</span>
					</div>
                }
            </div>
        </li>
    );
};

export default ListItem;
