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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(notes.map(n => n.category || 'Uncategorized'))];

    const filteredNotes = (notes || []).filter(note => {
        const matchesSearch = (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (note.content || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || (note.category || 'Uncategorized') === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-transparent text-text font-sans selection:bg-gray-200">
            <header className="p-6 md:p-12 max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-2"
                >
                    Notes
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center gap-4 justify-between"
                >
                    <p className="text-gray-400 text-lg">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </p>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gta-purple placeholder-gray-500 text-gray-800 w-full md:w-64 shadow-sm"
                    />
                </motion.div>

                {/* Category Filter Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-gta-purple text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/40 hover:bg-white/60 text-gray-700 hover:text-gray-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </header>

            <main className="max-w-7xl mx-auto pb-24">
                <NoteGrid notes={filteredNotes} onDelete={deleteNote} onNoteClick={handleNoteClick} onReorder={reorderNotes} />
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
