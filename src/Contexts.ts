import {createContext} from "react";
import IGetData from "./api/IGetData";

export const GetDataContext = createContext<IGetData>({} as IGetData)