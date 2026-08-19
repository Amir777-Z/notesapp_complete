import {createContext, type Dispatch} from "react";
import type {ActionType} from "../components/App.tsx";

export const ReducerContext = createContext<Dispatch<ActionType>>(()=>{});
