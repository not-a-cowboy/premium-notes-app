import { openDB } from 'idb';

const DB_NAME = 'premium-notes-db';
const DB_VERSION = 1;

export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('notes')) {
                db.createObjectStore('notes', { keyPath: 'id' });
            }
        },
    });
}

export async function getNotes() {
    const db = await initDB();
    return db.getAll('notes');
}

export async function saveNote(note) {
    const db = await initDB();
    return db.put('notes', note);
}

export async function deleteNote(id) {
    const db = await initDB();
    return db.delete('notes', id);
}

export async function clearNotes() {
    const db = await initDB();
    return db.clear('notes');
}

// Bulk import for migration
export async function importNotes(notes) {
    const db = await initDB();
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    for (const note of notes) {
        await store.put(note);
    }
    await tx.done;
}
