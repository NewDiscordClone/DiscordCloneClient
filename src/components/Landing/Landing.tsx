import React, {createContext, useEffect, useState} from 'react';
import Header from "./Header/Header";
import styles from "./Landing.module.scss"
import Section from "./Section/Section";
import TextBlock from "./TextBlock/TextBlock";
import ImageBlock from "./ImageBlock/ImageBlock";
import FullSizeTextBlock from "./FullSizeTextBlock/FullSizeTextBlock";
import ReadyToStart from "./ReadyToStart/ReadyToStart";
import Footer from "./Footer/Footer";
import {useNavigate} from "react-router-dom";
import {GetServerData} from "../../api/GetServerData";
import {signinSilent} from "../../auth/user-service";

const Landing = () => {
    const navigate = useNavigate();
    const [isAuthorized, setAuthorized] = useState<boolean>(false);

    useEffect(() => {
        const apiUri = process.env.REACT_APP_API_URI ?? "https://sparkle.net.ua";

        function load(/*stack: number = 0*/): Promise<void> {
            return signinSilent()
                .then(() => {
                    return new GetServerData(apiUri).users.getUser();
                })
                .then(() => setAuthorized(true))
                .catch((e) => {
                    console.log(e);
                    // console.log(stack)
                    // if(stack < 1)
                    //     return load(stack + 1);
                    // else
                    //     console.log("out of attempts")
                });
        }

        new GetServerData(apiUri).users.getUser()
            .then(() => setAuthorized(true))
            .catch(() => load());
    })

    function openSparkle() {
        navigate("/app");
    }

    return (
        <div className={styles.landing}>
            <Header open={openSparkle} isAuthorized={isAuthorized}/>
            <Section reverse first>
                <TextBlock
                    header={"Create an invite-only place where you belong"}
                    text={"Sparkle servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat."}/>
                <ImageBlock src={"images/invite-only.svg"}/>
            </Section>
            <Section>
                <TextBlock
                    header={"Where hanging out is easy"}
                    text={"Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around and instantly pop in to talk without having to call."}/>
                <ImageBlock src={"images/hanging out.svg"}/>
            </Section>
            <Section reverse>
                <TextBlock
                    header={"From few to a fandom"}
                    text={"Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more."}/>
                <ImageBlock src={"images/fandom.svg"}/>
            </Section>
            <FullSizeTextBlock
                header={"Reliable tech for staying close"}
                text={"You can always chat with friends and create a cool server!"}/>
            <ImageBlock src={"images/stayClose.png"}/>
            <ReadyToStart open={openSparkle}/>
            <Footer open={openSparkle}/>
        </div>
    );
};

export default Landing;
