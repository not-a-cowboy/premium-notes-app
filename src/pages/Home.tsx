import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/NoteGrid';
import { AddNoteButton } from '../components/AddNoteButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, X, LayoutDashboard, Share2 } from 'lucide-react';
import { ThemePicker } from '../components/ThemePicker';
import { CloudSyncPanel } from '../components/CloudSyncPanel';

export function Home() {
    const { notes, isLoading, deleteNote, togglePin } = useNotes();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-4 border-m-yellow border-t-transparent animate-spin rounded-none"></div>
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
        if (a.isPinned === b.isPinned) {
            return new Date(b.updatedAt || b.date!).getTime() - new Date(a.updatedAt || a.date!).getTime();
        }
        return a.isPinned ? -1 : 1;
    });

    const handleNoteClick = (note: import('../types').Note) => {
        navigate(`/note/${note.id}`);
    };

    return (
        <div className="min-h-screen bg-transparent text-m-white font-sans selection:bg-m-yellow selection:text-black">
            {/* Header Area */}
            <header className="p-6 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b-2 border-m-gray pb-4 relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-m-yellow opacity-50 hidden md:block" />

                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-m-white mb-2 font-display"
                        >
                            Jot<span className="text-m-yellow">.</span>IX
                        </motion.h1>
                        <p className="text-m-yellow font-technical text-xs tracking-widest uppercase">
                            Secure Note System // v4.2.0 // <span className="text-white">{notes.length} Active Records</span>
                        </p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto items-center">
                        <div className="relative group flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="SEARCH_DB..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-m-black border-2 border-m-gray px-4 py-3 text-sm font-technical text-white placeholder-gray-600 focus:outline-none focus:border-m-yellow transition-colors rounded-none"
                            />
                            {/* Input Corner Accent */}
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-m-gray group-focus-within:bg-m-yellow transition-colors" />
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 bg-m-black border-2 border-m-gray hover:border-m-white hover:bg-m-gray transition-all text-white rounded-none group"
                            title="System Config"
                        >
                            <Settings className="group-hover:rotate-90 transition-transform duration-500" size={20} />
                        </button>
                    </div>
                </div>

                {/* Category Filter Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none items-center"
                >
                    <span className="text-m-gray font-technical text-xs mr-2 uppercase tracking-wider">Fltr:</span>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat
                                ? 'bg-m-yellow text-black border-m-yellow'
                                : 'bg-transparent text-gray-500 border-m-gray hover:border-white hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </header>

            {/* Note Grid Area */}
            <main className="max-w-[1600px] mx-auto px-6 pb-24">
                <NoteGrid notes={filteredNotes} onDeleteNote={deleteNote} onNoteClick={handleNoteClick} onTogglePin={togglePin} />
            </main>

            {/* Add Button - Floating FAB but Technical */}
            <div className="fixed bottom-8 right-8 z-40">
                <AddNoteButton onClick={() => navigate('/new')} />
            </div>

            {/* Settings Modal - Redesigned */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-m-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-m-dark border-2 border-m-gray p-0 w-full max-w-md z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Decorative Header Strip */}
                            <div className="h-2 bg-m-yellow w-full" />

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black uppercase text-white tracking-tight">System Config</h2>
                                    <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-m-red transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <Link
                                        to="/board"
                                        className="p-4 bg-m-black border border-m-gray hover:border-m-yellow transition-all flex flex-col items-center justify-center gap-2 group"
                                        onClick={() => setIsSettingsOpen(false)}
                                    >
                                        <LayoutDashboard className="text-gray-400 group-hover:text-m-yellow" size={24} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Kanban</span>
                                    </Link>
                                    <Link
                                        to="/graph"
                                        className="p-4 bg-m-black border border-m-gray hover:border-m-blue transition-all flex flex-col items-center justify-center gap-2 group"
                                        onClick={() => setIsSettingsOpen(false)}
                                    >
                                        <Share2 className="text-gray-400 group-hover:text-m-blue" size={24} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Graph</span>
                                    </Link>
                                </div>

                                <div className="mb-6 space-y-4">
                                    <div className="border border-m-gray p-4 bg-m-black">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Cloud Storage</h3>
                                        <CloudSyncPanel />
                                    </div>
                                    <div className="border border-m-gray p-4 bg-m-black">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Interface Theme</h3>
                                        <ThemePicker compact={true} />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-m-gray">
                                    <p className="text-xs font-technical text-gray-600 mb-2 uppercase">System API Key [Gemini]</p>
                                    <input
                                        type="password"
                                        placeholder="KEY_MISSING"
                                        className="w-full bg-m-black border border-m-gray px-3 py-2 text-xs font-mono text-m-yellow focus:border-m-yellow focus:outline-none"
                                        onChange={(e) => localStorage.setItem('premium-notes-ai-key', e.target.value)}
                                        defaultValue={localStorage.getItem('premium-notes-ai-key') || ''}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
