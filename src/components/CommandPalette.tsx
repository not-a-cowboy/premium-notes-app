import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Plus, Home, LucideIcon } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';

interface ActionItem {
    id: string;
    title: string;
    icon: LucideIcon;
    action: () => void;
    content?: undefined;
}

type CommandItem = ActionItem | Note;

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { notes } = useNotes();
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter notes based on search
    const filteredNotes = search.trim() === '' ? [] : notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    // Static actions
    const actions: ActionItem[] = [
        { id: 'new', title: 'Create New Note', icon: Plus, action: () => navigate('/new') },
        { id: 'home', title: 'Go Home', icon: Home, action: () => navigate('/') },
    ];

    // Combine results: Actions first if no search, else Actions + Notes
    const results: CommandItem[] = search.trim() === '' ? actions : [...actions, ...filteredNotes];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setSearch('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (item: CommandItem) => {
        setIsOpen(false);
        if ('action' in item && item.action) {
            item.action();
        } else {
            // It's a note
            navigate(`/note/${item.id}`);
        }
    };

    // Keyboard navigation for list
    useEffect(() => {
        if (!isOpen) return;
        const handleNavigation = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            }
        };
        window.addEventListener('keydown', handleNavigation);
        return () => window.removeEventListener('keydown', handleNavigation);
    }, [isOpen, results, selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-xl overflow-hidden relative z-10 flex flex-col"
                    >
                        <div className="p-4 border-b border-gray-200/50 flex items-center gap-3">
                            <Search className="text-gray-400" size={20} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search notes or commands..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400"
                            />
                            <div className="flex gap-1">
                                <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">esc</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto py-2">
                            {results.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No results found.</div>
                            ) : (
                                results.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${index === selectedIndex ? 'bg-gta-purple/20 text-gta-purple' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        {'icon' in item ? (
                                            <item.icon size={18} className={index === selectedIndex ? "text-gta-purple" : "text-gray-400"} />
                                        ) : (
                                            <FileText size={18} className={index === selectedIndex ? "text-gta-purple" : "text-gray-400"} />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${index === selectedIndex ? "text-gray-900" : ""}`}>{item.title}</p>
                                            {!('action' in item) && (
                                                <p className="text-xs text-gray-400 truncate">{item.content}</p>
                                            )}
                                        </div>
                                        {index === selectedIndex && (
                                            <span className="text-xs text-gta-purple font-medium">↵</span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="bg-gray-50/50 p-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-end gap-3 px-4">
                            <span>⇅ to navigate</span>
                            <span>↵ to select</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
