import {createContext} from "react";
import {ReducerState} from "./components/App/reducer";
import {EventP} from "./Events";

export const AppContext = createContext<ReducerState>({} as ReducerState);

type SelectedChat = {
    selectedChatId: string | undefined;
    selectChat: (chatId: string | undefined) => void;
    chatChanged: EventP<{oldChat: string | undefined, newChat: string | undefined}>;
}
export const SelectedChatContext = createContext<SelectedChat>({} as SelectedChat);
