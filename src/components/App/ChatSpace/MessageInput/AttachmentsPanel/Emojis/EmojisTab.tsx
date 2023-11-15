import React, {useEffect, useRef, useState} from 'react';
import styles from "../AttachmentsPanel.module.scss";
import tabStyles from "./Emojis.module.scss"
import appStyles from "../../../../App.module.scss";
import EmojisGroup from "./EmojisGroup";
import groupsJson from "./group-emoji.json"
import emojiTermsJson from "./emoji-terms.json"
import GroupDictionary from "./GroupDictionary";
import csx from "classnames";
import TermsDictionary from "./TermsDictionary";
import EmojiPanel from "./EmojiPanel";
import Twemoji from 'react-twemoji';
import GroupsPanel from "./GroupsPanel";

type Props = {
    close: () => void;
}
const groups = groupsJson as unknown as GroupDictionary
const terms = emojiTermsJson as unknown as TermsDictionary

const EmojisTab = ({close}: Props) => {
    const [search, setSearch] = useState<string>("");
    const [hover, setHover] = useState<string>(Object.keys(terms)[0]);
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
                <div className={tabStyles.emojisPanel} onScroll={handleScroll}>
                    <Twemoji options={{className: 'emoji'}}>
                        {Object.keys(groups).map((groupName) =>
                            <EmojisGroup
                                key={groupName}
                                group={groupName}
                                onHover={handleHover}
                                scrollTop={scrollTop}
                                setSelectedGroup={setSelectedGroup}
                            />)}
                    </Twemoji>
                </div>
                <EmojiPanel e={hover}/>
            </div>
        </div>
    );
};

export default EmojisTab;