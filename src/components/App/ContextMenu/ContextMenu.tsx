import React, {useEffect, useRef} from 'react';
import styles from "./ContextMenu.module.scss";
import csx from "classnames";
import {ContextOption} from "./ContextOption";

type Props = {
    options: (ContextOption | null)[]
    closeMenu: () => void;
    style?: React.CSSProperties
    outerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
    className?: string
}
const ContextMenu = ({options, closeMenu, style, outerRef, className} : Props) => {
    const innerRef =  useRef<HTMLDivElement>()

    useEffect(() => {
        function onClick(event: any) {
            if (outerRef) {
                if(outerRef.current && !outerRef.current.contains(event.target))
                    closeMenu();
            }
            else if (innerRef && innerRef.current && !innerRef.current.contains(event.target)) {
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
            className={csx(styles.contextMenu, className)}
            style={style}
            ref={innerRef as any}
            onContextMenu={e => e.preventDefault()}
        >
            {options.map((opt, i) => opt ?
                <div
                    key={i}
                    className={csx(
                        styles.option,
                        {
                            [styles.highlight]: opt.highlight,
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