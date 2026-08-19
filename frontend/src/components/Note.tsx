
import { useContext, useState, memo, useEffect } from 'react';
import { NoteActionsContext } from '../contexts/NoteActionsContext.tsx';
import { getParsedLocalStorage } from './App.tsx';
import { jwtDecode } from 'jwt-decode';


type notesWebsiteToken = {
    username: string;
    id: string;
    iat: string;
};
export type Note = {
    title: string;
    author: {
        name: string;
        email: string;
    } ;
    content: string;
    userId: string;
};

export type NoteWithId = {
    title: string;
    author: {
        name: string;
        email: string;
    };
    content: string;
    userId: string;
    _id: string;
}
export const NoteComp =
    memo(function NoteCompFunc({
        id, title, author, content, userId
    }: {
        id: string;
        title: string;
        author: { name: string; email: string };
        content: string;
        userId: string;
    }) {
        const [isEditing, setEditing] = useState(false);
        const handleNoteActions = useContext(NoteActionsContext);
        const [text, setText] = useState(content);
        const currentUserData = getParsedLocalStorage('current_logged_user');
        const token: notesWebsiteToken | null = currentUserData ? jwtDecode<notesWebsiteToken>(currentUserData.token) : null;
        useEffect(() => {
            setText(content);
        }, [content]);


        return (
            <div>
                <div key={id} className="note" data-testid={id}>
                    <h2>{title}</h2>
                    <h3>{content}</h3>
                    <small>By {author?.name ?? "Unknown"}</small>
                    {(!isEditing) ?
                        <div>
                            <button data-testid={`edit-${id}`} disabled={token == null || token.id != userId} onClick={() => setEditing(!isEditing)}>Edit note content</button>
                            <button name={`delete-${id}`} disabled={token == null || token.id != userId} onClick={() => handleNoteActions.delete({_id:id})}>Delete Note</button>
                        </div>
                        :
                        <div data-testid={id}>
                            <input type="text" value={text} name={`text_input-${id}`}
                                onChange={(e) => setText(e.target.value)} />
                            <br />
                            <button name={`text_input_save-${id}`} onClick={() => {
                                handleNoteActions.edit({
                                    content: text,
                                    _id:id,
                                    
                                });
                                setEditing(false);
                            }}>
                                Save changes
                            </button>
                            <button name={`text_input_cancel-${id}`} onClick={() => {
                                setText(content);
                                setEditing(false)
                            }}>Cancel changes</button>
                        </div>}

                </div>
            </div>
        );
    });




