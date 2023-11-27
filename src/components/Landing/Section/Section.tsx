import React, {ReactNode} from 'react';
import styles from "./Section.module.scss"
import useMinWidthChecker from "../../useMinWidthChecker";
import csx from "classnames";
type Props = {
    children: ReactNode,
    reverse?: boolean
    first?: boolean;
}
const Section = ({children, reverse = false, first = false} : Props) => {
    const isPageNarrow = useMinWidthChecker(1100);

    return (
        <div className={csx(styles.section, {[styles.reverse]: reverse,[styles.narrow]: isPageNarrow, [styles.first]: first})}>
            {children}
        </div>
    );
};

export default Section;