// context/NoteActionsContext.tsx
import { createContext } from 'react';
import type {addNoteProps, editNoteProps,deleteNoteProps} from '../lib/formSendings'

export type NoteActions = {
    add: (addProps: addNoteProps) => void;
    edit: (editProps:editNoteProps) => void;
    delete: (deleteProps:deleteNoteProps) => void;
};

export const NoteActionsContext = createContext<NoteActions>({
    add: () => {},
    edit: () => {},
    delete: () => {},
});
