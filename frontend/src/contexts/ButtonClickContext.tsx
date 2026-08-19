import {createContext} from "react";
type ButtonClickHandler =(page:number) =>void;
export const ButtonClickContext=createContext<ButtonClickHandler>(()=>{});