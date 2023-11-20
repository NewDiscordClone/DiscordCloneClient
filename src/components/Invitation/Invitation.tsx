import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { GetServerData } from "../../api/GetServerData";
import { InvitationDetails } from "../../models/InvitationDetails";

const Invitation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [getData,] = useState(new GetServerData(process.env.REACT_APP_API_URI ?? "https://sparkle.net.ua"));
    const [details, setDetails] = useState<InvitationDetails>();

    useEffect(() => {
        console.log(id);
        getData.invitations.getInvitation(id as string).then(details => {
            console.log(details);

            setDetails(details);
        })//.catch(() => console.log("Error"));

    }, [getData, id])

    if (!details) return <p>"Invitation is not accessible"</p>

    function splitOnKeys(name: string, obj: any) {
        if (obj === undefined)
            return <li>{name}: {"undefined"}</li>
        if (obj === null)
            return <li>{name}: {"null"}</li>
        if (typeof obj === "object") {
            return <>
                <li>{name}:</li>
                <ul>{Object.keys(obj).map(k => splitOnKeys(k, obj[k]))}</ul>
            </>
        } else {
            return <li>{name}: {obj.toString()}</li>
        }
    }

    function join() {
        getData.servers.joinServer(details?.id as string).then(() => navigate("/"))
    }

    return (
        <>
            {
                splitOnKeys("details", details)
            }
            <input type={"button"} onClick={join} value={"Join"} />
        </>
    );
};

export default Invitation;