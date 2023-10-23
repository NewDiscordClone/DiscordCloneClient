import React, {MutableRefObject, ReactNode, useId, useRef} from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import csx from "classnames";
import {ContextOption} from "../ContextMenu/ContextOption";
import {useContextMenu} from "../ContextMenu/ContextMenuProvider";

type Props = {
    element: IListElement;
    isChannel?: boolean;
    addContent?: (element: IListElement, ref: MutableRefObject<HTMLLIElement | undefined>) => ReactNode
    setContextAction?: (element: IListElement) => (ContextOption | null)[] | null
}
const ListItem = ({element, isChannel = false, addContent, setContextAction}: Props) => {

    const id = useId();
    if(setContextAction) {
        const options = setContextAction(element);
        if(options)
        {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useContextMenu({
                id,
                options
            })
        }
    }

    const ref = useRef<HTMLLIElement>();
    return (
        <li className={csx(styles.component, {[styles.channel]: isChannel, [styles.selected]: element.isSelected})}
            onClick={() => element.clickAction != null && element.clickAction()}
            ref={ref as any}
            id={id}>
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
            {addContent && addContent(element, ref)}
        </li>
    );
};

export default ListItem;
