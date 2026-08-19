import { useContext, useState } from "react";
import { NoteActionsContext } from "../contexts/NoteActionsContext";

export function AddButton() {
    const [isEditing, setEditing] = useState(false);
    const [text, setText] = useState("");
    const [title, setTitle] = useState("")
    const handleNoteActions = useContext(NoteActionsContext);
    return (
        <>
            {
                (!isEditing) ?
                    <button name="add_new_note" onClick={() => setEditing(true)}>
                        Add Note Form
                    </button>
                    :
                    <div>
                        <label>Title of the note</label>
                        <input
                            type="text"
                            name="title_input_new_note"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                        <br />
                        <label>Content of the note</label>
                        <input
                            type="text"
                            name="text_input_new_note"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <br />
                        <button
                            name="text_input_save_new_note"
                            onClick={() => {
                                setEditing(false);
                                setTitle("");
                                setText("");
                                handleNoteActions.add({
                                    title: title,
                                    content: text,
                                })
                            }}
                        >
                            Save note
                        </button>
                        <button
                            name="text_input_cancel_new_note"
                            onClick={() => {
                                setText("");
                                setEditing(false);
                            }}
                        >
                            Cancel creation
                        </button>
                    </div>
            }
        </>
    );
}
