import { useEffect, useState, useReducer } from 'react'
import './App.css'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Pagination } from "./Pagination.tsx";
import { ButtonClickContext } from '../contexts/ButtonClickContext.tsx'; import { NoteComp, type Note, type NoteWithId } from "./Note";
import { AddButton } from "./AddButton.tsx";
import { NotesContext } from "../contexts/NotesContext.tsx";
import { Notification } from "./Notification";
import { NoteActionsContext } from '../contexts/NoteActionsContext.tsx';
import type { addNoteProps, deleteNoteProps, editNoteProps } from '../lib/formSendings.ts';
import type { errorObject } from '../lib/types/errorObject.ts';

export type NoteDict = {
    [id: string]: Note;
};
const NOTES_URL = 'http://localhost:3001/notes';
export type ActionType =
    | { type: 'EDIT_NOTE'; id: string; newContent: string }
    | { type: 'DELETE_NOTE'; id: string }
    | { type: 'IMPORT_NOTES'; notes: NoteWithId[] }
    | { type: 'ADDED_NOTE' }
    | { type: 'EMPTY_NOTES' };
export function getParsedLocalStorage<T = any>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function handleUnload(totalPages: number) {
    return () => deleteLocalStorage(totalPages);
}
function deleteLocalStorage(totalPages: number): void {
    for (let i = 1; i <= totalPages; i++) {
        if (getParsedLocalStorage(`page_${i}`)) {
            localStorage.removeItem(`page_${i}`)
        }
    }
}


export default function App() {

    const [currentPage, setCurrent] = useState(1);
    const [notes, dispatch] = useReducer(reducer, {});
    const [resync, setResync] = useState(false);
    const POSTS_PER_PAGE = 10;
    const [totalPages, setTotalPages] = useState(10);//Default one.
    const [status, setStatus] = useState('');
    const userData = getParsedLocalStorage("current_logged_user")
    const [token, setToken] = useState(userData ? userData.token : null)
    const notification = <Notification name="Notification" op_happened={status}></Notification>
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        let didcancel = false;
        let totalPagesForDeletion = totalPages;

        // Helper function to fetch a page if it's not in memory
        const fetchPageIfNeeded = async (pageNum: number) => {
            if (!getParsedLocalStorage(`page_${pageNum}`) && !didcancel) {
                try {
                    const response = await axios.get(NOTES_URL, {
                        params: {
                            _page: pageNum,
                            _limit: POSTS_PER_PAGE,
                        },
                        signal
                    });

                    if (!didcancel && response.status === 200) {
                        localStorage.setItem(`page_${pageNum}`, JSON.stringify(response.data));
                    }
                } catch (error) {
                    alert("Can't bring notes, try later")
                }
            }
        };

        // Helper function to determine which pages to prefetch
        const getPagesToFetch = (current: number, total: number): number[] => {
            if (total <= 5) {
                // If total pages <= 5, fetch all pages
                return Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
            } else if (current <= 3) {
                // For pages 1, 2, 3 - fetch pages 1-5
                return Array.from({ length: 5 }, (_, i) => i + 1);
            } else if (current >= total - 2) {
                // For last 3 pages - fetch last 5 pages
                return Array.from({ length: 5 }, (_, i) => total - 4 + i);
            } else {
                // For middle pages - fetch current page ±2
                return Array.from({ length: 5 }, (_, i) => current - 2 + i);
            }
        };

        // First, fetch the current page to get total count
        axios.get(NOTES_URL, {
            params: {
                _page: currentPage,
                _limit: POSTS_PER_PAGE,
            },
            signal
        }).then(response => {
            if (didcancel) return;
            if (response.status === 200) {
                const totalCount = parseInt(response.headers['x-total-count']);
                if (!isNaN(totalCount) && totalCount >= 0) {
                    const updatedTotalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
                    totalPagesForDeletion = updatedTotalPages;
                    setTotalPages(updatedTotalPages);

                    // Set current page data
                    dispatch({
                        type: 'IMPORT_NOTES',
                        notes: response.data
                    });

                    // Store current page in localStorage if not already there
                    if (!getParsedLocalStorage(`page_${currentPage}`)) {
                        localStorage.setItem(`page_${currentPage}`, JSON.stringify(response.data));
                    }

                    // Determine which additional pages to prefetch
                    const pagesToFetch = getPagesToFetch(currentPage, updatedTotalPages);

                    // Remove current page from the list since we already have it
                    const additionalPages = pagesToFetch.filter(page => page !== currentPage);

                    // Prefetch additional pages that aren't in memory
                    additionalPages.forEach(pageNum => {
                        fetchPageIfNeeded(pageNum);
                    });

                } else {
                    dispatch({ type: 'EMPTY_NOTES' });
                }
            }
        }).catch(error => {
            if (error.response && error.status === 500) {
                alert(error.response);
            } else if (!didcancel) {
                alert("Error while syncing notes");
            }
        });

        const unloadHandler = handleUnload(totalPagesForDeletion);
        window.addEventListener('unload', unloadHandler);

        return () => {
            didcancel = true;
            window.removeEventListener('unload', unloadHandler);
            controller.abort();
        }
    }, [currentPage, resync]);
    function reducer(state: NoteDict, action: ActionType): NoteDict {
        switch (action.type) {
            case 'EMPTY_NOTES':
                return {}
            case 'EDIT_NOTE':
                return {
                    ...state,
                    [action.id]: {
                        ...state[action.id],
                        content: action.newContent,
                    }
                };
            case "IMPORT_NOTES":
                const incoming: NoteDict = {};
                action.notes.forEach(notePlus => {
                    incoming[notePlus._id] = {
                        title: notePlus.title,
                        author: notePlus.author,
                        content: notePlus.content,
                        userId: notePlus.userId,
                    };
                });
                // Only return new object if content is different
                const isSame = Object.keys(incoming).length === Object.keys(state).length &&
                    Object.keys(incoming).every(k =>
                        JSON.stringify(incoming[k]) === JSON.stringify(state[k])
                    );
                if (isSame) return state;
                return incoming;
        }
        return state;
    }
    function deleteNote(deleteProps: deleteNoteProps) {
        axios.delete(`${NOTES_URL}/${deleteProps._id}`, {
            headers: {
                Authorization: "Bearer " + token
            },
        })
            .then(response => {
                if (response.status == 204) {
                    deleteLocalStorage(totalPages);
                    setStatus('NOTE_DELETED');
                    setResync(prev => !prev);
                }
            }).catch(error => {
                const errorFields = error.response.data as errorObject
                if (errorFields.messages) {
                    if (errorFields.messages.length == 1) {
                        alert(errorFields.title + ": " + errorFields.messages[0])
                    }
                    else {
                        const reasons = errorFields.messages.slice(1).reduce((previousReasons, reason) => previousReasons + ", " + reason, errorFields.messages[0])
                        alert(errorFields.title + ": " + reasons)
                    }

                }
                else {
                    alert(errorFields.title + ", try again later")
                }
            });
    }
    function addNote(addProps: addNoteProps) {
        axios.post(NOTES_URL, addProps, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(response => {
                if (response.status == 201) {
                    deleteLocalStorage(totalPages);
                    setStatus('NOTE_ADDED');
                    setResync(prev => !prev);
                }
            }).catch(error => {
                const errorFields = error.response.data as errorObject
                if (errorFields.messages) {
                    if (errorFields.messages.length == 1) {
                        alert(errorFields.title + ": " + errorFields.messages[0])
                    }
                    else {
                        const reasons = errorFields.messages.slice(1).reduce((previousReasons, reason) => previousReasons + ", " + reason, errorFields.messages[0])
                        alert(errorFields.title + ": " + reasons)
                    }

                }
                else {
                    alert(errorFields.title + ", try again later")
                }
            });
    }


    function editNote(editProps: editNoteProps) {
        axios.put(`${NOTES_URL}/${editProps._id}`, {
            content: editProps.content,
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(response => {
                if (response.status == 200) {
                    setStatus("NOTE_EDITED")
                    dispatch({
                        type: 'EDIT_NOTE',
                        id: editProps._id,
                        newContent: editProps.content
                    })
                }
                localStorage.removeItem(`page_${currentPage}`);
                setResync(prev => !prev)
            }
            ).catch(error => {
                  const errorFields = error.response.data as errorObject
                if (errorFields.messages) {
                    if(errorFields.messages.length==1){
                        alert(errorFields.title + ": " + errorFields.messages[0])
                    }
                    else{
                        const reasons = errorFields.messages.slice(1).reduce((previousReasons, reason) => previousReasons + ", " + reason, errorFields.messages[0])
                    alert(errorFields.title + ": " + reasons)
                    }
                    
                }
                else {
                    alert(errorFields.title+", try again later")
                }
            });
    }

    function handleClick(page: number) {//In here, we remove all the ceche from the pages we don't see
        if (totalPages <= 5) {//All the pages will be shown, therefore we don't need to delete their ceche
            setCurrent(page);
        }
        else {
            //Going back to the special cases...
            if (page <= 3) {//In the cases of 1,2,3 we still show pages 4 and 5
                for (let i = 6; i <= totalPages; i++) {
                    if (getParsedLocalStorage(`page_${i}`)) {
                        localStorage.removeItem(`page_${i}`)
                    }
                }
            }
            else if (page >= totalPages - 2) {//In the case of the last page,last page-1, last page-2, we will show the 4 pages before the last page
                for (let i = 1; i < totalPages - 4; i++) {
                    if (getParsedLocalStorage(`page_${i}`)) {
                        localStorage.removeItem(`page_${i}`)
                    }
                }
            }
            else {//All other cases
                for (let i = 1; i < page - 2; i++) {
                    if (getParsedLocalStorage(`page_${i}`)) {
                        localStorage.removeItem(`page_${i}`)
                    }
                }
                for (let i = page + 3; i <= totalPages; i++) {
                    if (getParsedLocalStorage(`page_${i}`)) {
                        localStorage.removeItem(`page_${i}`)
                    }
                }
            }
        }
        setCurrent(page)
    }
    return (
        <>
            <div style={{ marginBottom: '10px' }}>
            </div>
            {
                !userData ?
                    <>

                        <div className="top-right-nav">
                            <Link to="/login" className="nav-button" data-testid="go_to_login_button" onClick={() => deleteLocalStorage(totalPages)}>
                                Go to Login
                            </Link>
                            <Link to="/create-user" className="nav-button" data-testid="go_to_create_user_button" onClick={() => deleteLocalStorage(totalPages)}>
                                Create New User
                            </Link>
                        </div>
                    </>
                    :
                    null
            }
            <>
                <div >{notification}</div>
                <NoteActionsContext.Provider value={
                    {
                        "add": addNote,
                        "delete": deleteNote,
                        "edit": editNote
                    }
                }>
                    <NotesContext.Provider value={notes}>
                        <div>
                            {Object.values(notes).length > 0 ? (
                                Object.keys(notes).map((key: string) => {
                                    const note: Note = notes[key];
                                    return (
                                        <div key={key}>
                                            <NoteComp
                                                key={key}
                                                id={key}
                                                title={note.title}
                                                userId={note.userId}
                                                author={note.author ?? null}
                                                content={note.content}
                                            />
                                        </div>
                                    )
                                })) : (
                                <p>No notes found.</p>
                            )
                            }
                        </div>
                        <ButtonClickContext.Provider value={handleClick}>
                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                        </ButtonClickContext.Provider>
                        {
                            userData ?
                                <>
                                    <AddButton />
                                    <button data-testid={"logout"} name={"logout button"} onClick={
                                        () => {
                                            setToken(null)
                                            localStorage.removeItem('current_logged_user');
                                            setResync(!resync);
                                        }
                                    } >Logout</button>
                                </>
                                : null
                        }

                    </NotesContext.Provider>
                </NoteActionsContext.Provider></>

        </>
    );
};

