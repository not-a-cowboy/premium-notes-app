import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/NoteGrid';
import { AddNoteButton } from '../components/AddNoteButton';
import { NoteModal } from '../components/NoteModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const { notes, addNote, deleteNote, reorderNotes } = useNotes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const navigate = useNavigate();

    const handleSaveNote = (noteData) => {
        addNote(noteData);
        setIsModalOpen(false);
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    }

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-gray-200">
            <header className="p-6 md:p-12 max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-2"
                >
                    Notes
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-gray-400 text-lg"
                >
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </motion.p>
            </header>

            <main className="max-w-7xl mx-auto pb-24">
                <NoteGrid notes={notes} onDelete={deleteNote} onNoteClick={handleNoteClick} onReorder={reorderNotes} />
            </main>

            <AddNoteButton onClick={() => navigate('/new')} />

            <AnimatePresence>
                {isModalOpen && (
                    <NoteModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSave={handleSaveNote}
                        note={selectedNote}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
