import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/NoteGrid';
import { AddNoteButton } from '../components/AddNoteButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, X, LayoutDashboard } from 'lucide-react';
import { ThemePicker } from '../components/ThemePicker';
import { CloudSyncPanel } from '../components/CloudSyncPanel';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export function Home() {
    const { notes, isLoading, deleteNote, togglePin, reorderNotes } = useNotes();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

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
        // Only sort by pinned status, otherwise respect array order (for DND)
        if (a.isPinned === b.isPinned) {
            return 0;
        }
        return a.isPinned ? -1 : 1;
    });

    const handleNoteClick = (note: import('../types').Note) => {
        navigate(`/note/${note.id}`);
    };

    const isFiltered = searchQuery !== '' || selectedCategory !== 'All';

    return (
        <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)] selection:text-black">
            {/* Header Area */}
            <header className="p-6 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b-2 border-[var(--card-border)] pb-4 relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-primary)] opacity-50 hidden md:block" />

                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 font-display"
                            style={{ color: 'var(--logo-text)' }}
                        >
                            Jot<span style={{ color: 'var(--subtitle-text)' }}>.</span>IX
                        </motion.h1>
                        <p className="font-technical text-xs tracking-widest uppercase" style={{ color: 'var(--subtitle-text)' }}>
                            Secure Note System // v4.2.0 // <span className="text-[var(--text-primary)]">{notes.length} Active Records</span>
                        </p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto items-center">
                        <div className="relative group flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="SEARCH_DB..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 text-sm font-technical placeholder-gray-600 focus:outline-none transition-colors rounded-none"
                                style={{
                                    backgroundColor: 'var(--nav-input-bg)',
                                    borderColor: 'var(--nav-input-border)',
                                    color: 'var(--nav-input-text)',
                                    borderWidth: '2px'
                                }}
                            />
                            {/* Input Corner Accent */}
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--card-border)] group-focus-within:bg-[var(--accent-primary)] transition-colors" />
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 border-2 transition-all rounded-none group"
                            style={{
                                backgroundColor: 'var(--nav-input-bg)',
                                borderColor: 'var(--nav-input-border)',
                                color: 'var(--nav-input-text)'
                            }}
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
                    <span className="text-[var(--text-muted)] font-technical text-xs mr-2 uppercase tracking-wider">Fltr:</span>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat
                                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]'
                                : 'bg-transparent text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </header>

            {/* Note Grid Area */}
            <main className="max-w-[1600px] mx-auto px-6 pb-24">
                <NoteGrid
                    notes={filteredNotes}
                    onDeleteNote={deleteNote}
                    onNoteClick={handleNoteClick}
                    onTogglePin={togglePin}
                    onReorderNotes={isFiltered ? undefined : reorderNotes}
                />
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
                            className="relative bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-0 w-full max-w-md z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Decorative Header Strip */}
                            <div className="h-2 bg-[var(--accent-primary)] w-full" />

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-tight">System Config</h2>
                                    <button onClick={() => setIsSettingsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <Link
                                    to="/graph"
                                    className="p-4 bg-[var(--bg-primary)] border border-[var(--card-border)] hover:border-[var(--accent-primary)] transition-all flex flex-col items-center justify-center gap-2 group"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    <div className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">Graph</div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Graph</span>
                                </Link>
                                <button
                                    className="col-span-2 p-4 bg-[var(--bg-primary)] border border-[var(--card-border)] hover:border-[var(--accent-primary)] transition-all flex flex-col items-center justify-center gap-2 group"
                                    onClick={() => {
                                        setIsSettingsOpen(false);
                                        setShowAnalytics(true);
                                    }}
                                >
                                    <LayoutDashboard className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Productivity Analytics</span>
                                </button>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div className="border border-[var(--card-border)] p-4 bg-[var(--bg-primary)]">
                                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Cloud Storage</h3>
                                    <CloudSyncPanel />
                                </div>
                                <div className="border border-[var(--card-border)] p-4 bg-[var(--bg-primary)]">
                                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2">Interface Theme</h3>
                                    <ThemePicker compact={true} />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
                                <p className="text-xs font-technical text-[var(--text-muted)] mb-2 uppercase">System API Key [Gemini]</p>
                                <input
                                    type="password"
                                    placeholder="KEY_MISSING"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--card-border)] px-3 py-2 text-xs font-mono text-[var(--accent-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                                    onChange={(e) => localStorage.setItem('premium-notes-ai-key', e.target.value)}
                                    defaultValue={localStorage.getItem('premium-notes-ai-key') || ''}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAnalytics && (
                    <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
