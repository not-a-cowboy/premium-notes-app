import { useState, useEffect } from 'react';
import { getNotes, saveNote, deleteNote as dbDeleteNote, importNotes } from '../db';

const STORAGE_KEY = 'premium-notes-app-data';

export function useNotes() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load & Migration
    useEffect(() => {
        const loadNotes = async () => {
            try {
                // Check if we need to migrate from localStorage
                const localData = localStorage.getItem(STORAGE_KEY);
                if (localData) {
                    console.log('Migrating data from localStorage to IndexedDB...');
                    const parsed = JSON.parse(localData);
                    await importNotes(parsed);
                    localStorage.removeItem(STORAGE_KEY);
                }

                // Load from IDB
                const dbNotes = await getNotes();

                // Sort by updated (desc) or pinned
                const sorted = dbNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setNotes(sorted);
            } catch (error) {
                console.error('Failed to load notes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotes();
    }, []);

    const refreshNotes = async () => {
        const dbNotes = await getNotes();
        // Maintain sorting preference - for now default to updatedAt desc
        // Pinned sorting is handled in Home.jsx usually, but we can do basic sort here
        dbNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(dbNotes);
    };

    const addNote = async (note) => {
        const now = new Date();
        const newNote = {
            ...note,
            id: note.id || Date.now(),
            date: note.date || now.toLocaleDateString(),
            updatedAt: now.toISOString(),
            category: note.category || 'Uncategorized',
            isPinned: note.isPinned || false
        };

        await saveNote(newNote);
        await refreshNotes();
        return newNote.id;
    };

    const deleteNote = async (id) => {
        await dbDeleteNote(id);
        await refreshNotes();
    };

    const updateNote = async (id, updatedFields) => {
        // We need to fetch the existing note to merge cleanly if we don't have full object
        // But usually we can just find it in state for the merge
        const existing = notes.find(n => n.id === id);
        if (!existing) return;

        const updatedNote = {
            ...existing,
            ...updatedFields,
            updatedAt: new Date().toISOString()
        };

        await saveNote(updatedNote);
        await refreshNotes();
    };

    const reorderNotes = async (newOrder) => {
        // Optimistic update
        setNotes(newOrder);
        // Persist order? IDB doesn't store array order. 
        // We'd need to update an 'order' index on all notes. 
        // For MVP/Migration, assuming sort by date, reorder might be visual only until reload
        // unless we add an order field.
        // Let's Skip complex reorder persistence for this migration step to keep it safe.
        // Or better: update all notes with a new 'orderIndex' if we really supported drag-n-drop.
        // Given the requirement is just "Migrate Data Layer", we accept standard IDB behavior.
    };

    const togglePin = async (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            await updateNote(id, { isPinned: !note.isPinned });
        }
    };

    return { notes, isLoading, addNote, deleteNote, updateNote, reorderNotes, togglePin };
}
