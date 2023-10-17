import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ContextMenuObject} from "./ContextMenuObject";
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import ContextMenu from "./ContextMenu";

export const ContextMenuContext = createContext<(menu: ContextMenuObject) => void>({} as any);

export function useContextMenu(menu: ContextMenuObject) {
    const func = useContext(ContextMenuContext);
    func(menu);
}

type Props = {
    children: ReactNode
}
const menuObjects: ContextMenuObject[] = []
const ContextMenuProvider = ({children}: Props) => {
    const [params, setParams] = useState<ContextMenuShowParams>();

    function setContextMenu(menu: ContextMenuObject) {
        if (!menu.id) return;
        const index = menuObjects.findIndex(m => m.id === menu.id)
        if (index < 0)
            menuObjects.unshift(menu)
        else {
            // console.log("override");
            menuObjects[index] = menu;
        }
    }

    useEffect(() => {
        function onContextMenu(event: MouseEvent) {
            // event.preventDefault(); TODO: Use when release
            // console.log(menuObjects)
            for (const menu of menuObjects) {
                setParams(undefined);
                if (document.getElementById(menu.id)?.contains(event.target as any)) {
                    event.preventDefault();
                    setParams({
                        x: event.x,
                        y: event.y,
                        options: menu.options
                    });
                    break;
                }
            }
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