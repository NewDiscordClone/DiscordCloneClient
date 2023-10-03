import React from 'react';
import styles from "./CreateChatModal.module.scss"

type Props = {
    user: {displayName: string; id: string}
    onClick: (id: string) => void;
}
const UserButton = ({user, onClick} : Props) => {
    function handleOnClick(e: any) {
        e.preventDefault();
        e.stopPropagation()
        onClick(user.id);
    }

    return (
        <div className={styles.userButton} onClick={handleOnClick}>
            {user.displayName}
            <svg
                width="8" height="8"
                viewBox="0 0 17 17"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="Vector" d="M16.2234 2.08122L10.1624 8.14214L16.2234 14.2031L14.2031 16.2234L8.14214 10.1624L2.08122 16.2234L0.0609156 14.2031L6.12183 8.14214L0.060915 2.08122L2.08122 0.0609152L8.14214 6.12183L14.2031 0.0609159L16.2234 2.08122Z" fill="currentColor"/>
            </svg>
        </div>
    );
};

export default UserButton;