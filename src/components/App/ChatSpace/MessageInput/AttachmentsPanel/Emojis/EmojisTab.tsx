import React, {useEffect, useRef, useState} from 'react';
import styles from "../AttachmentsPanel.module.scss";
import tabStyles from "./Emojis.module.scss"
import appStyles from "../../../../App.module.scss";
import EmojisGroup from "./EmojisGroup";
import groupsJson from "./group-emoji.json"
import emojiTermsJson from "./emoji-terms.json"
import GroupDictionary from "./GroupDictionary";
import csx from "classnames";
import EmojiPanel from "./EmojiPanel";
import Twemoji from 'react-twemoji';
import GroupsPanel from "./GroupsPanel";
import SearchEmojis from "./SearchEmojis";

type Props = {
    close: () => void;
    pasteEmoji?: (char: string) => void;
}
const groups = groupsJson as unknown as GroupDictionary

const EmojisTab = ({close, pasteEmoji}: Props) => {
    const [search, setSearch] = useState<string>("");
    const [hover, setHover] = useState<string>(Object.keys(emojiTermsJson)[0]);
    const [selectedGroup, setSelectedGroup] = useState<string>(Object.keys(groups)[0]);
    const [scrollTop, setScrollTop] = useState<number>(0);
    const searchRef = useRef<HTMLInputElement>();

    useEffect(() => {
        // Lazy load emojis after the initial parsing
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach((emoji) => {
            emoji.setAttribute('loading', 'lazy');
        });
    })

    function handleHover(char: string) {
        setHover(char);
    }

    function handleScroll(e: React.UIEvent<HTMLDivElement>) {
        setScrollTop(e.currentTarget.scrollTop);
    }

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (!pasteEmoji) return;
        pasteEmoji(hover);
        if (!e.shiftKey)
            close();
    }

    return (
        <div>
            <div className={styles.inputContainer}>
                <input
                    className={appStyles.customInput}
                    type={"text"}
                    placeholder={"Search Tenor"}
                    value={search}
                    ref={searchRef as any}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className={csx(styles.content, tabStyles.content)}>
                <GroupsPanel selectedGroup={selectedGroup}/>
                <div className={tabStyles.emojisPanel} onScroll={handleScroll} onClick={handleClick}>
                    <Twemoji options={{className: 'emoji'}}>
                        {search ?
                            <SearchEmojis searchTerm={search} onHover={handleHover} onClick={handleClick}/>
                            :
                            Object.keys(groups).map((groupName) =>
                                <EmojisGroup
                                    key={groupName}
                                    group={groupName}
                                    onHover={handleHover}
                                    scrollTop={scrollTop}
                                    setSelectedGroup={setSelectedGroup}
                                />)
                        }
                    </Twemoji>
                </div>
                <EmojiPanel e={hover}/>
            </div>
        </div>
    );
};

export default EmojisTab;