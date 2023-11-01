import React, {useContext, useEffect, useState} from 'react';
import {AppContext, SelectedChatContext} from "../../../Contexts";
import {PrivateChatViewModel} from "../../../models/PrivateChatViewModel";
import {ActionType} from "../reducer";
import {UserDetails} from "../../../models/UserDetails";
import UserInfo from "../UserInfo/UserInfo";

const UserInfoColumn = () => {
    const {chats, getData, dispatch, user} = useContext(AppContext);
    const {selectedChatId} = useContext(SelectedChatContext);
    const [details, setDetails] = useState<UserDetails>()
    if(!selectedChatId) throw new Error("selectedChatId is can't be undefined at this point");
    const chat = chats[selectedChatId] as unknown as PrivateChatViewModel;

    useEffect(() => {
        if (!chat.profiles) {
            getData.privateChats
                .getDetails(selectedChatId as string)
                .then(c => {
                    console.log(c)
                    if (!(c as PrivateChatViewModel).ownerId) {
                        return getData.users
                            .getUser(c.profiles.filter(p => p.userId !== user.id)[0].userId)
                            .then(u => {
                                dispatch({
                                    type: ActionType.PrivateChatSaved,
                                    value: {
                                        ...c,
                                        image: u.avatar,
                                        userDetails: u,
                                        userStatus: u.status,
                                        userTextStatus: u.textStatus
                                    }
                                })
                            });
                    }
                })
        } else {
            setDetails((chat as any).userDetails)
        }
    }, [chat.profiles, dispatch, getData.privateChats, getData.users, selectedChatId, user.id])

    return (
        <>
            {details &&
				<UserInfo userDetails={details}/>
            }
        </>
    );
};

export default UserInfoColumn;