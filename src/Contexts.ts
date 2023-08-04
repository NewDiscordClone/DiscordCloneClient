import {createContext} from "react";
import {ReducerState} from "./components/App/reducer";
import Chat from "./models/Chat";
import Server from "./models/Server";
import {EventP} from "./Events";
import Channel from "./models/Channel";

export const AppContext = createContext<ReducerState>({} as ReducerState);
export const SelectedChatContext = createContext<Chat>({} as Chat);

type SelectedServer = {
    selectedServer: (Server & {selectedChannel: Channel}) | undefined,
    serverSelected: EventP<(Server & {selectedChannel: Channel}) | undefined>
}
export const SelectedServerContext = createContext<SelectedServer>({} as SelectedServer);