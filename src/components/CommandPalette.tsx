import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Plus, Home, LucideIcon, Terminal, Command } from 'lucide-react';
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
        { id: 'new', title: 'Initialize New Record', icon: Plus, action: () => navigate('/new') },
        { id: 'home', title: 'Return to Hub', icon: Home, action: () => navigate('/') },
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
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 font-mono">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-m-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.1 }}
                        className="w-full max-w-2xl bg-m-dark border-2 border-m-gray shadow-2xl relative z-10 flex flex-col clip-path-polygon"
                    >
                        {/* Header Decoration */}
                        <div className="h-1 w-full bg-gradient-to-r from-m-yellow via-m-red to-m-blue" />

                        <div className="p-4 border-b-2 border-m-gray flex items-center gap-4 bg-black/20">
                            <Terminal className="text-m-yellow" size={24} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="EXECUTE_COMMAND..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                className="flex-1 bg-transparent border-none outline-none text-xl text-m-white placeholder-gray-600 uppercase font-black tracking-tight"
                            />
                            <div className="flex gap-1">
                                <span className="text-[10px] border border-gray-600 text-gray-500 px-1.5 py-0.5 uppercase">ESC_TO_CANCEL</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto py-0">
                            {results.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-xs uppercase tracking-widest border-l-4 border-red-500 bg-red-500/10 mx-4 my-4">
                                    ERR: NO_MATCHING_RECORDS_FOUND
                                </div>
                            ) : (
                                results.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all border-l-4 ${index === selectedIndex
                                                ? 'bg-m-yellow text-black border-m-white'
                                                : 'hover:bg-white/5 text-gray-400 border-transparent hover:border-gray-500'
                                            }`}
                                    >
                                        {'icon' in item ? (
                                            <item.icon size={20} className={index === selectedIndex ? "text-black" : "text-gray-500"} />
                                        ) : (
                                            <FileText size={20} className={index === selectedIndex ? "text-black" : "text-gray-500"} />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold uppercase tracking-wider text-sm ${index === selectedIndex ? "text-black" : "text-m-white"}`}>
                                                {item.title}
                                            </p>
                                            {!('action' in item) && (
                                                <p className={`text-[10px] font-mono mt-0.5 truncate ${index === selectedIndex ? "text-black/70" : "text-gray-600"}`}>
                                                    ID_{item.id} // {item.content}
                                                </p>
                                            )}
                                        </div>
                                        {index === selectedIndex && (
                                            <span className="text-xs font-black uppercase tracking-widest text-black">ENTER ↵</span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="bg-m-black p-2 border-t border-m-gray text-[10px] text-gray-500 flex justify-between px-4 font-mono uppercase">
                            <span>SYS_READY // v4.2</span>
                            <div className="flex gap-4">
                                <span>⇅ NAVIGATE</span>
                                <span>↵ SELECT</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
