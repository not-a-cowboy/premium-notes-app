import { useState, useEffect } from 'react';

const STORAGE_KEY = 'premium-notes-app-data';

export function useNotes() {
    const [notes, setNotes] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved).filter(n => n);
                // Deduplicate by ID
                const seen = new Set();
                return parsed.filter(n => {
                    const duplicate = seen.has(n.id);
                    seen.add(n.id);
                    return !duplicate;
                });
            }
            return [
                { id: 1, title: 'Welcome', content: 'Welcome to your new premium note-taking app. This is a sample note.', category: 'Personal', isPinned: true, date: new Date().toLocaleDateString(), updatedAt: new Date().toISOString() },
                { id: 2, title: 'Design', content: 'Remember to keep the design fresh and clean. Use whitespace effectively.', category: 'Work', isPinned: false, date: new Date().toLocaleDateString(), updatedAt: new Date().toISOString() },
                { id: 3, title: 'Animations', content: 'The animations should be subtle but noticeable. Spring physics make it feel alive.', category: 'Design', isPinned: false, date: new Date().toLocaleDateString(), updatedAt: new Date().toISOString() },
            ];
        } catch (error) {
            console.error('Failed to load notes:', error);
            return [];
        }
    });

    // Remove the useEffect that watches notes to avoid double-writing and race conditions
    // useEffect(() => {
    //     localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    // }, [notes]);

    const saveToStorage = (newNotes) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
    };

    const addNote = (note) => {
        const now = new Date();
        const newNote = {
            ...note,
            id: note.id || Date.now(),
            date: note.date || now.toLocaleDateString(),
            updatedAt: now.toISOString(),
            category: note.category || 'Uncategorized',
            isPinned: note.isPinned || false
        };
        setNotes(prev => {
            const next = [newNote, ...prev];
            saveToStorage(next);
            return next;
        });
    };

    const deleteNote = (id) => {
        setNotes(prev => {
            const next = prev.filter(note => note.id !== id);
            saveToStorage(next);
            return next;
        });
    };

    const updateNote = (id, updatedFields) => {
        setNotes(prev => {
            const next = prev.map(note => note.id === id ? { ...note, ...updatedFields, updatedAt: new Date().toISOString() } : note);
            saveToStorage(next);
            return next;
        });
    };

    const reorderNotes = (newOrder) => {
        setNotes(newOrder);
        saveToStorage(newOrder);
    };

    return { notes, addNote, deleteNote, updateNote, reorderNotes };
}
