import React, {ReactElement, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import styles from "./ScrollContainer.module.scss";
import {SelectedChatContext} from "../../../../../Contexts";

type Props = {
    children: ReactNode;
    onScrollToTop?: () => void
    setScrollTop?: (value: number) => void;
    savedScrollTop?: number
}
const ScrollContainer = ({children, onScrollToTop, setScrollTop, savedScrollTop}: Props) => {
    const {selectedChatId} = useContext(SelectedChatContext)
    const ref = useRef<HTMLDivElement>();
    const [prevHeight, setHeight] = useState<number>(ref.current?.scrollHeight ?? 0);

    function onScroll() {
        const container = ref.current
        if (!container) return;
        if (container.scrollTop === 0 && onScrollToTop) {
            onScrollToTop();
        }
    }

    useEffect(() => {
        const container = ref.current;
        if (!container) return;
        if (!children) return;
        const dFromBottom = prevHeight - container.clientHeight - container.scrollTop;
        // console.log(prevHeight + " - " + container.clientHeight + " - " + container.scrollTop + " = " + dFromBottom);
        if (dFromBottom === 0 || container.scrollTop === 0) {
            //preserve distance from bottom
            container.scrollTop = container.scrollHeight - container.clientHeight - dFromBottom;
            // console.log("set scroll: " + container.scrollTop);
        }
        //else: preserve distance from the top (nothing should be done)

    }, [children])

    const container = ref.current;
    if (container) {
        if (container.scrollHeight !== prevHeight) {
            console.log(container.scrollHeight);
            setHeight(container.scrollHeight);
        }
    }
    return (
        <div
            className={styles.container}
            ref={ref as any}
            onScroll={onScroll}
        >
            <div></div>
            {children}

        </div>
    );
};

export default ScrollContainer;