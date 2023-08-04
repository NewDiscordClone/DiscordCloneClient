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
                    <div className={styles.swgIconContainer}>
                        <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true"
                             role="img">
                            <path
                                fill="#80848E"
                                d={element.image}>
                            </path>
                        </svg>
                    </div>
                    :
                    <div className={styles.iconContainer}>
                        <img src={element.image} alt={"chatImage"}/>
                    </div>
            }
            <div className={csx(styles.text, {[styles.channelText]: isChannel})}>
                <div>
                    <strong>{element.title}</strong>
                </div>
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
