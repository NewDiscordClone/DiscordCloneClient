import React from 'react';
import {ContextMenuShowParams} from "./ContextMenuShowParams";
import ContextMenu from "./ContextMenu";

type Props = {
    params: ContextMenuShowParams
    closeMenu: () => void;
}
const ContextMenuPosition = ({params, closeMenu}: Props) => {
    const screenW = window.innerWidth - 20;
    const screenH = window.innerHeight;

    const right = params.x > screenW - 200;
    const bottom = params.y > screenH - 200;
    const style: React.CSSProperties = {}

    if (right)
        style.right = screenW - params.x + 20
    else
        style.left = params.x + 5
    if (bottom)
        style.bottom = screenH - params.y -5;
    else
        style.top = params.y + 5

    return <ContextMenu style={style} options={params.options} closeMenu={closeMenu}/>
};

export default ContextMenuPosition;