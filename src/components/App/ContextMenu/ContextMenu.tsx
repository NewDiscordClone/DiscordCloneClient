import React, {useEffect, useRef} from 'react';
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import styles from "./ContextMenu.module.scss"

type Props = {
    params: ContextMenuShowParams
    closeMenu: () => void;
}
const ContextMenu = ({params, closeMenu} : Props) => {
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        function onClick(event: any) {
            if (ref && ref.current && !ref.current.contains(event.target)) {
                closeMenu();
            }
        }

        window.addEventListener("click", onClick)
        return () => {
            window.removeEventListener("click", onClick)
        }
    }, [closeMenu])

    return (
        <div
            className={styles.contextMenu}
            style={{left: params.x, top: params.y}}
            ref={ref as any}
        >
            {params.options.map((opt, i) => opt?
                <div key={i} className={styles.option} onClick={opt.action}>{opt.title}</div> :
                <hr key={i}/>
            )}
        </div>
    );
};

export default ContextMenu;