import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './ChatSpace.module.scss'
import csx from "classnames"
import MessageSpace from "./MessageSpace";
import MessageInput from "./MessageInput";
import Chat from "../../../../models/Chat";
import {GetDataContext} from "../../../../Contexts";
import styles2 from "./ChatSpace.module.scss";

const ChatSpace = ({chat, addMessages}: {chat: Chat, addMessages: () => void}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scrolledDistance, setScrolledDistance] = useState<number>(0);
    const [prevHeight, setPrevHeight] = useState<number>(0);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
            setScrolledDistance(distanceFromBottom);
            if(container.scrollTop === 0) {
                addMessages();
            }
        }
    };

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Set the scroll position to the saved distance from the bottom after rendering
    useEffect(() => {
        if (containerRef.current) {
            if(prevHeight!=containerRef.current.scrollHeight){
                containerRef.current.scrollTop = containerRef.current.scrollHeight - containerRef.current.clientHeight - scrolledDistance;
                setPrevHeight(containerRef.current.scrollHeight);
            }
        }
    }, [scrolledDistance]);

    return (
        <>
            <div className={styles2.firstRow}>
                {scrolledDistance}
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