import React, {ReactNode, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const minWidth = 550;
type Props = {
    children: ReactNode;
}
const MinWidthChecker = ({children}: Props) => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const navigate = useNavigate();

    useEffect(() => {
        function updateWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [])

    useEffect(() => {
        if (width < minWidth) {
            navigate("/");
        }
        console.log(width)
    }, [width])
    return (
        <>
            {children}
        </>
    );
};

export default MinWidthChecker;