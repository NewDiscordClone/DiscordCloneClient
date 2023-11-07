import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ContextMenuObject} from "./ContextMenuObject";
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import ContextMenuPosition from "./ContextMenuPosition";

export const ContextMenuContext = createContext<(menu: ContextMenuObject) => void>({} as any);

export function useContextMenu(menu: ContextMenuObject) {
    const func = useContext(ContextMenuContext);
    func(menu);
}

type Props = {
    children: ReactNode
}
const menuObjects: { [id: string]: ContextMenuObject } = {};
const ContextMenuProvider = ({children}: Props) => {
    const [params, setParams] = useState<ContextMenuShowParams>();

    function setContextMenu(menu: ContextMenuObject) {
        if (!menu.id) return;
        menuObjects[menu.id] = menu;
    }

    useEffect(() => {
        function onContextMenu(event: MouseEvent) {
            // event.preventDefault(); TODO: Use when release
            // console.log(menuObjects)
            const menu = Object.values(menuObjects).find(menu => document.getElementById(menu.id)?.contains(event.target as any))
            if (menu) {
                event.preventDefault();
                setParams({
                    x: event.x,
                    y: event.y,
                    options: menu.options
                });
            } else setParams(undefined);
        }

        window.addEventListener("contextmenu", onContextMenu)
        return () => {
            window.removeEventListener("contextmenu", onContextMenu);
        }
    }, [])

    return (
        <ContextMenuContext.Provider value={setContextMenu}>
            {params && <ContextMenuPosition params={params} closeMenu={() => setParams(undefined)}/>}
            {children}
        </ContextMenuContext.Provider>
    );
};

export default ContextMenuProvider;