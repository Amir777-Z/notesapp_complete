import {createContext} from "react";
import type {Note} from "../components/Note.tsx";
type NoteDict={
    [key:number]: Note;
};
export const NotesContext = createContext<NoteDict>({});
