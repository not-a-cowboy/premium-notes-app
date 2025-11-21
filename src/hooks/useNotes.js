import { useState, useEffect } from 'react';

const STORAGE_KEY = 'premium-notes-app-data';

export function useNotes() {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Welcome', content: 'Welcome to your new premium note-taking app. This is a sample note.', date: new Date().toLocaleDateString() },
            { id: 2, title: 'Design', content: 'Remember to keep the design fresh and clean. Use whitespace effectively.', date: new Date().toLocaleDateString() },
            { id: 3, title: 'Animations', content: 'The animations should be subtle but noticeable. Spring physics make it feel alive.', date: new Date().toLocaleDateString() },
        ];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, [notes]);

    const addNote = (note) => {
        setNotes(prev => [{ ...note, id: Date.now(), date: new Date().toLocaleDateString() }, ...prev]);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    const updateNote = (id, updatedFields) => {
        setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updatedFields } : note));
    };

    return { notes, addNote, deleteNote, updateNote };
}
