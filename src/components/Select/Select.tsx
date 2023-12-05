import React, {useEffect, useRef, useState} from "react";
import styles from "./Select.module.scss";
import csx from "classnames";

type Element = {
    title: string;
    icon?: string;
}

type Props = {
    elements: Element[]
    value?: Element
    onChange?: (element: Element) => void | boolean;
    className?: string
}
const Select = ({elements, value, onChange, className}: Props) => {
    const [selected, setSelected] = useState<Element>(elements[0])
    const [isOpen, setOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>();

    useEffect(() => {
        setSelected(value ?? selected);
    }, [selected, value])

    useEffect(() => {
        function onClick(event: any) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        window.addEventListener("click", onClick)
        return () => {
            window.removeEventListener("click", onClick)
        }
    }, [])

    function onSelect(element: Element) {
        if (!value)
            setSelected(element);
        if (!onChange || onChange(element)) {
            setOpen(false);
        }
    }

    if (!selected) return <></>
    return (
        <div className={csx(styles.select, className)} onClick={() => setOpen(true)} ref={selectRef as any}>
            {selected.icon ?
                <img src={selected.icon} alt={""}/> :
                selected.title &&
                <div><h4>{selected.title.slice(0, 2)}</h4></div>
            }
            <span>{selected.title} <img src={"icons/vectorDown.svg"} alt={"other"}/></span>
            {isOpen ?
                <div className={styles.dropdown}>
                    {elements.map((e, i) =>
                        <div key={i} className={styles.item} onClick={() => onSelect(e)}>
                            {/*{e.icon &&*/}
                            {e.icon ?
                                <img src={e.icon} alt={""}/> :
                                e.title &&
                                <div className={"textContainer"}><h4>{e.title.slice(0, 2)}</h4></div>
                            }
                            {/*}*/}
                            <span>{e.title}</span>
                        </div>
                    )}
                </div> : null
            }
        </div>
    );
};
export default Select