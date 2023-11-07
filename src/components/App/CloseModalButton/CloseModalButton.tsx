import React from 'react';
import styles from "./CloseModalButton.module.scss";
import csx from "classnames";

type Props = {
    close: () => void
    className?: string
}
const CloseModalButton = ({close, className}:Props) => {
    return (
        <svg
            className={csx(styles.closeButton, className)}
            width="17" height="17"
            viewBox="0 0 17 17"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            onClick={close}>
            <path id="Vector"
                  d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z"
                  fill="currentColor"/>
        </svg>
    );
};

export default CloseModalButton;