import React, {useEffect, useState} from 'react';
import ScrollContainer from "./App/ChatSpace/MessageSpace/ScrollContainer/ScrollContainer";
import Message from "../models/Message";
import MessageView from "./App/ChatSpace/MessageSpace/MessageView/MessageView";
import MessageViewModel from "./App/ChatSpace/MessageSpace/MessageView/MessageViewModel";
import message from "../models/Message";

let iterator = 0;
const messages: Message[] = []
const ScrollTest = () => {
    const [loadedMessages, setLoadedMessages] = useState<Message[]>([])
    const [isOnTop, setOnTop] = useState<boolean>();
    const [scrollTop, setScrollTop] = useState<number>()

    function addMessage() {
        messages.unshift({
            id: iterator.toString(),
            text: iterator.toString(),
            attachments: [],
            sendTime: new Date(),
            chatId: "1",
            author: {
                id: "1",
                displayName: "TestUser",
            },
            isPinned: false,
            reactions: [],
            pinnedTime: undefined
        })
        iterator++;
    }

    useEffect(() => {
        for (let i = 0; i < 100; i++) {
            addMessage();
        }

    }, []);
    useEffect(() => {
        setLoadedMessages(messages.slice(0, 40))
    }, [])

    function sendMessage() {
        addMessage();
        setLoadedMessages(prev => {
            const newState = [...prev];
            newState.unshift(messages[0])
            return newState;
        })
    }

    function onScrollToTop() {
        setLoadedMessages(prev =>
            [...prev].concat(messages.slice(prev.length, prev.length + 40))
        );
    }

    const messagesToView = [...loadedMessages].reverse();
    return (
        <div style={{display: "flex"}}>
            <div style={{
                boxSizing: "border-box",
                flex: "1",
                float: "left",
                height: "700px",
                backgroundColor: "#313131"
            }}>
                <ScrollContainer onScrollToTop={onScrollToTop}>
                    {messagesToView.map((m, i) =>
                        <MessageView key={m.id} message={new MessageViewModel(m)}
                                     prev={messages[i - 1]}
                                     isEdit={false}
                                     setEdit={() => {
                                     }}
                        />)}
                </ScrollContainer>
            </div>
            <div style={{boxSizing: "border-box", flex: "1", float: "right", height: "700px", overflow: "hidden"}}>
                <button onClick={sendMessage}>Add Message</button>
                <h2 style={{color: "white"}}>{scrollTop ?? "undefined"}</h2>
                {/*<button onClick={() => setOnTop(false)} style={isOnTop? {backgroundColor:"red"}: {}}>Is On Top</button>*/}
            </div>
        </div>
    );
};

export default ScrollTest;