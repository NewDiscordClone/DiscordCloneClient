import React from 'react';
import styles from "./SettingsModal.module.scss"
import TrueSelect from "../../Select/Select";

type Element = {
    title: string;
    icon?: string;
}

type Props = {
    elements: Element[]
    value?: Element
    onChange?: (element: Element) => void | boolean;
}
const Select = ({elements, value, onChange} : Props) => {
    return (<TrueSelect className={styles.select} elements={elements} onChange={onChange} value={value}/>)
};

export default Select;