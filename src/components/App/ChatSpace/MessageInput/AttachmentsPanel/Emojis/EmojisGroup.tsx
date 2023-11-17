import React, {useEffect, useRef} from 'react';
import styles from "./Emojis.module.scss"
import EmojiItem from "./EmojiItem";
import groupsJson from "./group-emoji.json"
import GroupDictionary from "./GroupDictionary";

type Props = {
    group: string
    scrollTop: number;
    setSelectedGroup: (group: string) => void;
    onHover?: (char: string) => void;
    onClick?: React.MouseEventHandler
}

const groups = groupsJson as unknown as GroupDictionary;

const EmojisGroup = ({group, onHover, onClick, scrollTop, setSelectedGroup}: Props) => {
    const list = groups[group];
    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        if (!ref.current) return;
        const groupTop = ref.current.offsetTop - 90;
        const groupBottom = groupTop + ref.current.clientHeight;
        // console.log(`${groupBottom} > ${scrollTop} > ${groupTop}`)
        if (groupBottom > scrollTop && scrollTop > groupTop)
            setSelectedGroup(group);
        
    }, [ref.current, scrollTop])

    return (
        <div className={styles.group} ref={ref as any} id={group}>
            <h3>{group}</h3>
            <div className={styles.emojis}>
                {list.map(e => <EmojiItem key={e.emoji} e={e.emoji} onHover={onHover} onClick={onClick}/>)}
            </div>
        </div>
    );
};

export default EmojisGroup;