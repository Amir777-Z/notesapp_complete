import { useEffect, useState } from 'react';

export function Notification({ op_happened, name }: { op_happened: string; name: string }) {
    const [text, setText] = useState('Notification area');

    useEffect(() => {
        switch (op_happened) {
            case 'NOTE_ADDED':
                setText('Added a new note');
                break;
            case 'NOTE_EDITED':
                setText('Note updated');
                break;
            case 'NOTE_DELETED':
                setText('Note deleted');
                break;
        }

        if (op_happened) {
            console.log(`${name}`);
        }
    }, [op_happened]);

    return <h1>{text}</h1>;
}
