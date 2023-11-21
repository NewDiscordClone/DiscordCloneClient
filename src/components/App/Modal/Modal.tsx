import React, {createContext, ReactNode, useCallback, useEffect, useState} from 'react';
import csx from "classnames";
import appStyles from "../App.module.scss";
import {Event} from "../../../Events";

export const ModalContext = createContext<{ isOpen: boolean, closeModal: () => void, beforeClose: Event}>({} as any);

type Props = {
    isOpen: boolean
    setOpen: (value: boolean) => void;
    children: ReactNode;
}
const Modal = ({isOpen, setOpen, children}: Props) => {
    const [beforeClose, ] = useState(new Event())
    const closeModal = useCallback(() => {
        beforeClose.invoke();
        setOpen(false);
    }, [setOpen]);
    const handleBackdropClick = (event: any) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        const handleEscapeKeyPress = (event: any) => {
            if (event.key === 'Escape') {

                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKeyPress);
        } else {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, [closeModal, isOpen]);
    return (
        <div className={csx(appStyles.backdrop, {[appStyles.show]: isOpen})} onMouseDown={handleBackdropClick}>
            {isOpen &&
				<ModalContext.Provider value={{isOpen, closeModal, beforeClose}}>
                    {children}
				</ModalContext.Provider>
            }
        </div>
    );
};

export default Modal;