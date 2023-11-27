import { useEffect, useState} from 'react';

// const minWidth = 550;
const useMinWidthChecker = (minWidth: number, onPageNarrow?: () => void) => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [isPageNarrow, setPageNarrow] = useState<boolean>(false);

    useEffect(() => {
        function updateWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [])

    useEffect(() => {
        if (width < minWidth) {
            setPageNarrow(true);
            if(onPageNarrow)
                onPageNarrow();
        }
        else if (width >= minWidth){
            setPageNarrow(false);
        }
        console.log(width)
    }, [width])
    return isPageNarrow;
};

export default useMinWidthChecker;