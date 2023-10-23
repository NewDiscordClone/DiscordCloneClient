import React, {createContext, ReactNode, useCallback, useEffect} from 'react';
import csx from "classnames";
import appStyles from "../App.module.scss";

export const ModalContext = createContext<{ isOpen: boolean, closeModal: () => void }>({} as any);

type Props = {
    isOpen: boolean
    setOpen: (value: boolean) => void;
    children: ReactNode;
}
const Modal = ({isOpen, setOpen, children}: Props) => {

    const closeModal = useCallback(() => {
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
				<ModalContext.Provider value={{isOpen, closeModal}}>
                    {children}
				</ModalContext.Provider>
            }
        </div>
    );
};

export default Modal;