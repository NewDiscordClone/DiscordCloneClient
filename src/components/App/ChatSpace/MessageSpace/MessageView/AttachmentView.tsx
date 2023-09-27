import React, {useContext, useEffect, useState} from 'react';
import {Attachment} from "../../../../../models/Attachment";
import {AppContext} from "../../../../../Contexts";
import styles from "./MessageView.module.scss"

const AttachmentView = ({attachmentList}: { attachmentList: Attachment[] }) => {
    const {getData} = useContext(AppContext);
    const [data, setData] = useState<any[]>([]);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded)
            attachmentList.forEach(a => {
                if (a.path.toLowerCase().endsWith(".png") ||
                    a.path.toLowerCase().endsWith(".jpg") ||
                    a.path.toLowerCase().endsWith(".jpeg") ||
                    a.path.toLowerCase().endsWith(".gif") ||
                    a.path.toLowerCase().endsWith(".webp"))
                    setData(prev => {
                        const newData = prev.map(d => d);
                        newData.push(<img style={{borderRadius: "10px"}} key={a.path} src={a.path}/>);
                        return newData;
                    });
                if(a.path.toLowerCase().endsWith(".mp4"))
                    setData(prev => {
                        const newData = prev.map(d => d);
                        newData.push(<video controls style={{borderRadius: "10px"}} key={a.path} src={a.path}/>);
                        return newData;
                    })
                if(a.path.toLowerCase().endsWith("mp3") ||
                    a.path.toLowerCase().endsWith("m4a") ||
                    a.path.toLowerCase().endsWith("ogg"))
                    setData(prev => {
                        const newData = prev.map(d => d);
                        newData.push(<audio controls style={{borderRadius: "10px"}} key={a.path} src={a.path}/>);
                        return newData;
                    })
            })
        setLoaded(true);
        return () => {
            // setData([]);
        }
    }, [attachmentList, getData, isLoaded])

    return <>{data.map((d, i) => <div key={i} className={styles.attachment}>{d}</div>)}</>;
};

export default AttachmentView;