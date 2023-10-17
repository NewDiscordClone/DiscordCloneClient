import React, {useEffect, useRef, useState} from 'react';
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import styles from "./ContextMenu.module.scss"
import csx from "classnames";

type Props = {
    params: ContextMenuShowParams
    closeMenu: () => void;
}
const ContextMenu = ({params, closeMenu}: Props) => {
    const ref = useRef<HTMLDivElement>()

    const screenW = window.innerWidth - 20;
    const screenH = window.innerHeight;

    const right = params.x > screenW - 200;
    const bottom = params.y > screenH - 200;
    const style: any = {}

    if (right)
        style.right = screenW - params.x + 20
    else
        style.left = params.x + 5
    if (bottom)
        style.bottom = screenH - params.y -5;
    else
        style.top = params.y + 5

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
            style={style}
            ref={ref as any}
            onContextMenu={e => e.preventDefault()}
        >
            {params.options.map((opt, i) => opt ?
                <div
                    key={i}
                    className={csx(
                        styles.option,
                        {
                            [styles.danger]: opt.danger,
                            [styles.disabled]: opt.disabled
                        }
                    )}
                    onClick={() => (opt?.action && !opt.action()) && closeMenu()}>{opt.title}</div> :
                <hr key={i}/>
            )}
        </div>
    );
};

export default ContextMenu;