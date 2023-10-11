import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ContextMenuObject} from "./ContextMenuObject";
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import ContextMenu from "./ContextMenu";

const ContextMenuContext = createContext<(menu: ContextMenuObject) => void>({} as any);
export function useContextMenu(menu: ContextMenuObject){
    const func = useContext(ContextMenuContext);
    useEffect(() => {
        func(menu);
    }, [func, menu, menu.contextRef, menu.options])
}

type Props = {
    children: ReactNode
}
const menuObjects: ContextMenuObject[] = []
const ContextMenuProvider = ({children} : Props) => {
    const [params, setParams] = useState<ContextMenuShowParams>();
    function setContextMenu(menu: ContextMenuObject) {
        if(!menu.contextRef.current) return;
        const index = menuObjects.findIndex(m => m.contextRef === menu.contextRef)
        if(index < 0)
            menuObjects.push(menu)
        else
            menuObjects[index] = menu;
    }

    useEffect(() => {
        function onContextMenu(event: MouseEvent) {
            event.preventDefault();
            console.log("cool");
            menuObjects.forEach((menu) => {
                setParams(undefined);
                if(menu.contextRef.current?.contains(event.target as any)){
                    setParams({
                        x: event.x,
                        y: event.y,
                        options: menu.options
                    });
                    console.log(menu.options)
                }
            })
        }
        window.addEventListener("contextmenu", onContextMenu)
        return () => {
            window.removeEventListener("contextmenu", onContextMenu);
        }
    }, [])

    return (
        <ContextMenuContext.Provider value={setContextMenu}>
            {params && <ContextMenu params={params} closeMenu={() => setParams(undefined)}/>}
            {children}
        </ContextMenuContext.Provider>
    );
};

export default ContextMenuProvider;