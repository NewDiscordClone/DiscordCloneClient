import React, {useContext, useState} from 'react';
import csx from "classnames";
import appStyles from "../App.module.scss";
import styles from "./RelationshipSpace.module.scss"
import {ApiException} from "../../../api/GetServerData";
import {AppContext} from "../../../Contexts";

type ResponseMessage = {
    text: string;
    className: string;
}
const FriendRequestSection = () => {
    const {getData} = useContext(AppContext);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState<ResponseMessage>();

    function sendFriendRequest() {
        getData.users
            .getUserByUserName(search)
            .then(u => getData.users.sendFriendRequest(u.id))
            .then(() => {
                setMessage({text: "Success! Your friend request to "+search+" was sent.", className: styles.successText});
                setSearch("");
            }).catch((e: ApiException) => {
                setMessage({
                    text:
                        e.result? (
                            "errors" in e.result?
                                Object.values(e.result.errors).join("\n"):
                                "title" in e.result? e.result.title : e.message) :
                            e.message, className: styles.errorText});
            }
        )
    }

    return (
        <div className={styles.addFriendSection}>
            <h2>Add Friend</h2>
            <p>You can add friends with their Sparkle usernames.</p>
            <div className={styles.inputContainer}>
                <input type={"text"}
                       maxLength={100}
                       placeholder={"You can add friends with their Sparkle usernames."}
                       className={csx(appStyles.customInput, styles.input)}
                       value={search}
                       onChange={({target: {value}}) => setSearch(value)}/>
                <div
                    className={csx(styles.submitButton, {[styles.disabled]: search.length <= 0})}
                    onClick={() => search.length > 0 ? sendFriendRequest() : null}>
                    Send Friend Request
                </div>
            </div>
            {message ? <span className={message.className}>{message.text}</span> : null}

        </div>
    );
};

export default FriendRequestSection;