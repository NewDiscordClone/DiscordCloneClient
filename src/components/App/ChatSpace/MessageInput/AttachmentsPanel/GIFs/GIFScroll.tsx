import React, {ReactNode} from 'react';
import styles from "../AttachmentsPanel.module.scss";
import csx from "classnames";
import tabStyles from "./GIFs.module.scss";
import PinterestGrid from "rc-pinterest-grid";

type Props = {
    children: ReactNode;
    onScrolledToBottom?: () => void;
}
const offset = 300;
const GIFScroll = ({children, onScrolledToBottom}: Props) => {

    function handleOnScroll(e: React.UIEvent<HTMLDivElement>) {
        if(!onScrolledToBottom) return;
        const container = e.currentTarget;
        // console.log(`scrollTop(${container.scrollTop}) === scrollHeight(${container.scrollHeight}) - clientHeight(${container.clientHeight}) (${container.scrollHeight - container.clientHeight})`)
        if (container.scrollHeight - container.clientHeight - container.scrollTop <= offset) {
            onScrolledToBottom();
        }
    }
    return (
        <div className={styles.content} onScroll={handleOnScroll}>
            <div className={csx(tabStyles.container)}>
                <PinterestGrid
                    columns={2}               // how many columns in one row
                    columnWidth={230}         // width of each block
                    gutterWidth={10}          // horizontal gutter between each block
                    gutterHeight={10}         // vertical gutter between each block
                >
                    {children}
                </PinterestGrid>
            </div>
        </div>
    );
};

export default GIFScroll;