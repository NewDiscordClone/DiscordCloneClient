import React, {useEffect, useRef, useState} from 'react';
import styles from "./Footer.module.scss"

export type Lang = {
    title: string;
    icon: string;
    code: string;
}

const languages: Lang[] = [
    {
        title: "English, USA",
        icon: "images/English USA.png",
        code: "us"
    },
    {
        title: "Українська",
        icon: "images/Ukraine.png",
        code: "ua"
    }
]
const LanguageSelect = () => {
    const [selected, setSelected] = useState<Lang>(languages[0])
    const [isOpen, setOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>();

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

    return (
        <div className={styles.select} onClick={() => setOpen(true)} ref={selectRef as any}>
            <img src={selected.icon} alt={selected.title}/>
            <span>{selected.title} <img src={"icons/vectorDown.svg"} alt={"other"}/></span>
            {isOpen ?
                <div className={styles.dropdown}>
                    {languages.map(l =>
                        <div className={styles.item} onClick={() => setSelected(l)}>
                            <img src={l.icon} alt={l.title}/>
                            <span>{l.title}</span>
                        </div>
                    )}
                </div> : null
            }
        </div>
    );
};

export default LanguageSelect;