import React, {MutableRefObject, ReactNode, useContext, useId, useRef} from 'react';
import styles from "./List.module.scss"
import IListElement from "./IListElement";
import csx from "classnames";
import {ContextOption} from "../ContextMenu/ContextOption";
import {useContextMenu} from "../ContextMenu/ContextMenuProvider";
import {AppContext} from "../../../Contexts";
import UserListElement from "./UserListElement";
import appStyles from "../App.module.scss"
import {UserDetails, UserStatus} from "../../../models/UserDetails";
import PersonalChatListItem from "./PersonalChatListItem";

type Props = {
    element: IListElement;
    isChannel?: boolean;
    addContent?: (element: IListElement, ref: MutableRefObject<HTMLLIElement | undefined>) => ReactNode
    setContextAction?: (element: IListElement) => (ContextOption | null)[] | null
}
const ListItem = ({element, isChannel = false, addContent, setContextAction}: Props) => {
    const {media, users} = useContext(AppContext);

    const id = useId();
    if (setContextAction) {
        const options = setContextAction(element);
        if (options) {
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
                    <div className={styles.statusIconContainer}>
                        <div className={styles.iconContainer}>
                            <img src={media[element.image] as string | undefined | null ?? undefined}
                                 alt={"chatImage"}/>
                        </div>
                        {element instanceof PersonalChatListItem &&
                            <div className={csx(appStyles.statusIcon, {[appStyles.online]: element.userStatus === UserStatus.Online})}/>
                        }
                        {element instanceof UserListElement &&
							<div className={csx(appStyles.statusIcon, {[appStyles.online]: element.user.status === UserStatus.Online})}/>
                        }
                    </div>
            }
            <div className={csx(styles.content, {[styles.channelText]: isChannel})}>
                <strong
                    style={{color: element instanceof UserListElement ? element.color : undefined}}>
                    {element.title}
                </strong>
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
