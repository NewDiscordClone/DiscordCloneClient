import React from 'react';
import styles from "./RolesManagerModal.module.scss"
import csx from "classnames";

type Props = {
    title: string;
    description: string;
    type: string;
    value: boolean | undefined;
    setValue?: (type: string, value: boolean | undefined) => void
}
const ClaimView = ({title, description, type, value, setValue}:Props) => {

    function handleOnChange(value: boolean | undefined) {
        if(!setValue) return;
        setValue(type, value)
    }

    return (
        <div className={styles.claim}>
            <div className={styles.text}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className={styles.switch}>
                <div className={csx({[styles.selected]: value === false})} onClick={() => handleOnChange(false)}>
                    <img src={"icons/cross.svg"} alt={"deny"}/>
                </div>
                <div className={csx({[styles.selected]: value === undefined})} onClick={() => handleOnChange(undefined)}>
                    <img src={"icons/slash.svg"} alt={"don't change"}/>
                </div>
                <div className={csx({[styles.selected]: value === true})}  onClick={() => handleOnChange(true)}>
                    <img src={"icons/tick.svg"} alt={"allow"}/>
                </div>
            </div>
        </div>
    );
};

export default ClaimView;