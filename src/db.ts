import { openDB, DBSchema } from 'idb';
import { Note } from './types';

const DB_NAME = 'premium-notes-db';
const DB_VERSION = 1;

interface NotesDB extends DBSchema {
    notes: {
        key: number;
        value: Note;
    };
}

export async function initDB() {
    return openDB<NotesDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('notes')) {
                db.createObjectStore('notes', { keyPath: 'id' });
            }
        },
    });
}

export async function getNotes(): Promise<Note[]> {
    const db = await initDB();
    return db.getAll('notes');
}

export async function saveNote(note: Note) {
    const db = await initDB();
    return db.put('notes', note);
}

export async function deleteNote(id: number) {
    const db = await initDB();
    return db.delete('notes', id);
}

export async function clearNotes() {
    const db = await initDB();
    return db.clear('notes');
}

// Bulk import for migration
export async function importNotes(notes: Note[]) {
    const db = await initDB();
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    for (const note of notes) {
        await store.put(note);
    }
    await tx.done;
}
