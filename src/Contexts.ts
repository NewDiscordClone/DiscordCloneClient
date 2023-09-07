import {createContext} from "react";
import {ReducerState} from "./components/App/reducer";
import Chat from "./models/Chat";
import ServerLookUp from "./models/ServerLookUp";
import {EventP} from "./Events";
import Channel from "./models/Channel";

export const AppContext = createContext<ReducerState>({} as ReducerState);
export const SelectedChatContext = createContext<Chat>({} as Chat);

type SelectedServer = {
    selectedServer: (ServerLookUp & {selectedChannel: Channel | undefined}) | undefined,
    serverSelected: EventP<(ServerLookUp & {selectedChannel: Channel | undefined}) | undefined>
}
export const SelectedServerContext = createContext<SelectedServer>({} as SelectedServer);