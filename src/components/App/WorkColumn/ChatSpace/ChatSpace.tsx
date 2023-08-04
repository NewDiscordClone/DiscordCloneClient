import React, {useEffect, useRef} from 'react';
import styles from './ChatSpace.module.scss'
import styles2 from './ChatSpace.module.scss'
import MessageSpace from "./MessageSpace";
import MessageInput from "./MessageInput";
import Chat from "../../../../models/Chat";
import IListElement from "../../List/IListElement";
import ListItem from "../../List/ListItem";

const ChatSpace = ({
                       chat,
                       loadMessages,
                       scrollState,
                       listItem
                   }: { chat: Chat, loadMessages: () => void, scrollState: [number, React.Dispatch<React.SetStateAction<number>>], listItem: IListElement }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scrolledDistance, setScrolledDistance] = scrollState;
    // const [prevHeight, setPrevHeight] = useState<number>(-1);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const distanceFromBottom = -container.scrollTop;
            setScrolledDistance(distanceFromBottom);
            if (distanceFromBottom >= container.scrollHeight - container.clientHeight) {
                console.log("addMessages")
                loadMessages();
            }
        }
    };

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef]);

    // Set the scroll position to the saved distance from the bottom after rendering
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // if(prevHeight!=container.scrollHeight){
            container.scrollTop = -scrolledDistance;
            // setPrevHeight(container.scrollHeight);
            // }
        }
        handleScroll();
    });

    return (
        <>
            <div className={styles2.firstRow}>
                <ListItem element={listItem} isChannel={`channel` in listItem}/>
            </div>
            <div className={styles.secondRow}>
                <MessageSpace messages={chat.messages} scrollableRef={containerRef}/>
            </div>
            <div className={styles.thirdRow}>
                <MessageInput/>
            </div>
        </>
    );
};

export default ChatSpace;