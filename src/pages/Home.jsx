import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/NoteGrid';
import { AddNoteButton } from '../components/AddNoteButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, X } from 'lucide-react';
import { ThemePicker } from '../components/ThemePicker';

export function Home() {
    const { notes, isLoading, addNote, deleteNote, reorderNotes, togglePin } = useNotes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="w-8 h-8 border-4 border-gta-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const categories = ['All', ...new Set(notes.map(n => n.category || 'Uncategorized'))];

    const filteredNotes = (notes || []).filter(note => {
        const matchesSearch = (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (note.content || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || (note.category || 'Uncategorized') === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        // Sort by Pinned (true first), then by Date (newest first)
        if (a.isPinned === b.isPinned) {
            return new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date);
        }
        return a.isPinned ? -1 : 1;
    });

    const handleNoteClick = (note) => {
        navigate(`/note/${note.id}`);
    };

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
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gta-purple placeholder-gray-500 text-gray-800 flex-1 md:w-64 shadow-sm"
                        />
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl hover:bg-white/80 transition-colors text-gray-600"
                            title="Settings & Themes"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </motion.div>

                {/* Settings Modal */}
                <AnimatePresence>
                    {isSettingsOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSettingsOpen(false)}
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-2xl shadow-2xl w-full max-w-sm z-10"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Appearance</h2>
                                    <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-black/5 rounded-full text-gray-500">
                                        <X size={20} />
                                    </button>
                                </div>
                                <ThemePicker />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Category Filter Chips */}

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
                <NoteGrid notes={filteredNotes} onDelete={deleteNote} onNoteClick={handleNoteClick} onReorder={reorderNotes} onTogglePin={togglePin} />
            </main>

            <AddNoteButton onClick={() => navigate('/new')} />
        </div>
    );
}
