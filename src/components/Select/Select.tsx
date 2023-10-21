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
        if(!value)
            setSelected(element);
        if(!onChange || onChange(element)) {
            setOpen(false);
        }
    }

    return (
        <div className={csx(styles.select, className)} onClick={() => setOpen(true)} ref={selectRef as any}>
            <img src={selected.icon} alt={""}/>
            <span>{selected.title} <img src={"icons/vectorDown.svg"} alt={"other"}/></span>
            {isOpen ?
                <div className={styles.dropdown}>
                    {elements.map((e, i) =>
                        <div key={i} className={styles.item} onClick={() => onSelect(e)}>
                            {/*{e.icon &&*/}
								<img src={e.icon} alt={""}/>
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