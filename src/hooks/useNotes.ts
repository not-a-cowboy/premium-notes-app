import { useState, useEffect } from 'react';
import { getNotes, saveNote, deleteNote as dbDeleteNote, importNotes } from '../db';
import { Note } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'premium-notes-app-data';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { user } = useAuth();

    // Initial Load & Migration & Sync
    useEffect(() => {
        const loadNotes = async () => {
            try {
                // 1. Migration from LocalStorage (Legacy)
                const localData = localStorage.getItem(STORAGE_KEY);
                if (localData) {
                    console.log('Migrating data from localStorage to IndexedDB...');
                    const parsed: Note[] = JSON.parse(localData);
                    await importNotes(parsed);
                    localStorage.removeItem(STORAGE_KEY);
                }

                // 2. Load Local Data
                let localNotes = await getNotes();

                // 3. Sync with Supabase (if logged in and configured)
                if (user && isSupabaseConfigured) {
                    const { data: cloudNotes, error } = await supabase
                        .from('notes')
                        .select('*')
                        .eq('user_id', user.id);

                    if (cloudNotes && !error) {
                        // Merge Logic: "Last Write Wins" based on updatedAt
                        const localMap = new Map(localNotes.map(n => [n.id, n]));

                        const mergedNotes: Note[] = [];
                        const processedIds = new Set<number>();

                        // ... (loop)


                        // Process Cloud Notes (Download or Update Local)
                        for (const cloudNote of cloudNotes) {
                            const localNote = localMap.get(Number(cloudNote.id));
                            processedIds.add(Number(cloudNote.id));

                            if (!localNote) {
                                // New from Cloud -> Save to Local
                                await saveNote(cloudNote as unknown as Note);
                                mergedNotes.push(cloudNote as unknown as Note);
                            } else {
                                // Conflict -> Check timestamps
                                const cloudTime = new Date(cloudNote.updated_at).getTime();
                                const localTime = new Date(localNote.updatedAt).getTime();

                                if (cloudTime > localTime) {
                                    // Cloud is newer -> Update Local
                                    const updated = { ...cloudNote, id: Number(cloudNote.id) } as unknown as Note;
                                    await saveNote(updated);
                                    mergedNotes.push(updated);
                                } else {
                                    // Local is newer (or equal) -> Keep Local (will push to cloud later if we want strict sync, but 'on change' handles pushes)
                                    // For initial load, we usually trust cloud if strictly newer, else keep local.
                                    // If local is explicitly newer, we should push to cloud? 
                                    // Let's just keep local in state for now.
                                    mergedNotes.push(localNote);

                                    // Optional: Push local to cloud if it was newer? 
                                    // Simply relying on "On Change" might miss offline edits unless we have a queue.
                                    // MVP: We assume user edits trigger sync.
                                    if (localTime > cloudTime) {
                                        // Background sync upstream could happen here
                                    }
                                }
                            }
                        }

                        // Process purely Local Notes (Upload to Cloud)
                        for (const localNote of localNotes) {
                            if (!processedIds.has(localNote.id)) {
                                // Exists locally but not in cloud -> Upload
                                const { error: upsertError } = await supabase.from('notes').upsert({
                                    id: localNote.id,
                                    user_id: user.id,
                                    title: localNote.title,
                                    content: localNote.content,
                                    category: localNote.category,
                                    is_pinned: localNote.isPinned,
                                    tags: localNote.tags,
                                    sketch_data: localNote.sketchData,
                                    updated_at: localNote.updatedAt,
                                    created_at: localNote.date ? new Date(localNote.date).toISOString() : new Date().toISOString()
                                });
                                if (!upsertError) {
                                    mergedNotes.push(localNote);
                                }
                            }
                        }

                        localNotes = mergedNotes;
                    }
                }

                // Sort by updated (desc)
                const sorted = (localNotes as Note[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setNotes(sorted);
            } catch (error) {
                console.error('Failed to load notes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotes();

        // 4. Realtime Subscription
        if (user && isSupabaseConfigured) {
            const channel = supabase
                .channel('remote-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${user.id}` }, async (payload) => {
                    // Refresh notes on any change
                    // This is slightly inefficient (refetching all), but safest for MVP consistency
                    await getNotes();
                    // Or apply payload directly if we map fields correctly
                    // For now, let's just re-trigger load or partial update
                    // console.log('Remote change received:', payload);
                    // Ideally: loadNotes() but that's inside effect.
                    // Let's just fetch updated note or all.
                    // A simple Strategy: Refresh from DB (which we need to update first from payload)

                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const newUrlNote = payload.new as any;
                        const converted: Note = {
                            id: Number(newUrlNote.id),
                            title: newUrlNote.title,
                            content: newUrlNote.content,
                            category: newUrlNote.category,
                            isPinned: newUrlNote.is_pinned,
                            tags: newUrlNote.tags,
                            sketchData: newUrlNote.sketch_data,
                            updatedAt: newUrlNote.updated_at,
                            date: newUrlNote.created_at
                        };
                        await saveNote(converted);
                        setNotes(prev => {
                            const filtered = prev.filter(n => n.id !== converted.id);
                            return [converted, ...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                        });
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = Number(payload.old.id);
                        await dbDeleteNote(deletedId);
                        setNotes(prev => prev.filter(n => n.id !== deletedId));
                    }
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }

    }, [user]); // Re-run when user logs in/out

    // const refreshNotes = async () => {
    //     const dbNotes = await getNotes();
    //     (dbNotes as Note[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    //     setNotes(dbNotes as Note[]);
    // };

    const refreshNotes = async () => {
        const dbNotes = await getNotes();
        // Maintain sorting preference - for now default to updatedAt desc
        // Pinned sorting is handled in Home.jsx usually, but we can do basic sort here
        (dbNotes as Note[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setNotes(dbNotes as Note[]);
    }

    const addNote = async (note: Partial<Note>) => {
        const now = new Date();
        const newNote: Note = {
            id: note.id || Date.now(),
            title: note.title || '',
            content: note.content || '',
            date: note.date || now.toLocaleDateString(),
            updatedAt: now.toISOString(),
            category: note.category || 'Uncategorized',
            isPinned: note.isPinned || false,
            tags: note.tags || [],
            sketchData: note.sketchData // Include sketch
        };

        // Local Save
        await saveNote(newNote);
        await refreshNotes(); // Updates UI immediately

        // Cloud Save
        if (user && isSupabaseConfigured) {
            await supabase.from('notes').upsert({
                id: newNote.id,
                user_id: user.id,
                title: newNote.title,
                content: newNote.content,
                category: newNote.category,
                is_pinned: newNote.isPinned,
                tags: newNote.tags,
                sketch_data: newNote.sketchData,
                updated_at: newNote.updatedAt,
                created_at: new Date().toISOString()
            });
        }

        return newNote.id;
    };

    const deleteNote = async (id: number) => {
        await dbDeleteNote(id);
        setNotes(prev => prev.filter(n => n.id !== id));

        if (user && isSupabaseConfigured) {
            await supabase.from('notes').delete().eq('id', id);
        }
    };

    const updateNote = async (id: number, updatedFields: Partial<Note>) => {
        const existing = notes.find(n => n.id === id);
        if (!existing) return;

        const updatedNote: Note = {
            ...existing,
            ...updatedFields,
            updatedAt: new Date().toISOString()
        };

        // Local
        await saveNote(updatedNote);

        // Optimistic UI update for performance
        setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));

        // Cloud
        if (user && isSupabaseConfigured) {
            await supabase.from('notes').upsert({
                id: updatedNote.id,
                user_id: user.id,
                title: updatedNote.title,
                content: updatedNote.content,
                category: updatedNote.category,
                is_pinned: updatedNote.isPinned,
                tags: updatedNote.tags,
                sketch_data: updatedNote.sketchData,
                updated_at: updatedNote.updatedAt,
                created_at: updatedNote.date ? new Date(updatedNote.date).toISOString() : new Date().toISOString() // fallback
            });
        }
    };

    const reorderNotes = async (newOrder: Note[]) => {
        setNotes(newOrder);
    };

    const togglePin = async (id: number) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            await updateNote(id, { isPinned: !note.isPinned });
        }
    };

    return { notes, isLoading, addNote, deleteNote, updateNote, reorderNotes, togglePin };
}
