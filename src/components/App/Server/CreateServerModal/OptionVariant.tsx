import React from 'react';
import styles from "./CreateServerModal.module.scss"

type Props = {
    text: string;
    image: string;
    onClick?: () => void
}
const OptionVariant = ({text, image, onClick} : Props) => {
    return (
        <div className={styles.optionButton} onClick={onClick}>
            <img className={styles.icon} src={image} alt={text}/>
            <div className={styles.text}>{text}</div>
        </div>
    );
};

export default OptionVariant;