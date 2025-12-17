import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { Sidebar } from '../components/Sidebar';

import { ArrowLeft, Save, Pin, Maximize2, Minimize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function NoteEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, addNote, updateNote } = useNotes();

    // Derived categories for suggestions
    const existingCategories = [...new Set(notes.map(n => n.category))];

    const foundNote = id ? notes.find(n => n.id === parseInt(id)) : null;

    const [title, setTitle] = useState(foundNote?.title || '');
    const [content, setContent] = useState(foundNote?.content || '');
    const [category, setCategory] = useState(foundNote?.category || 'Uncategorized');
    const [isPinned, setIsPinned] = useState(foundNote?.isPinned || false);
    const [isNew, setIsNew] = useState(!foundNote);
    const [saving, setSaving] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [fontFamily, setFontFamily] = useState('sans');
    const [textAlign, setTextAlign] = useState('left');

    const isLoaded = useRef(!!foundNote);


    useEffect(() => {
        if (!isLoaded.current) return;
        if (isNew && !title.trim() && !content.trim()) return;

        const timeoutId = setTimeout(() => {
            if (isNew) {
                const newId = Date.now();
                addNote({ id: newId, title, content, category, isPinned });
                setIsNew(false);
                navigate(`/note/${newId}`, { replace: true });
            } else {
                updateNote(parseInt(id), { title, content, category, isPinned });
            }
            setSaving(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, content, category, isPinned, id, isNew, addNote, updateNote, navigate]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (isNew) {
            addNote({ title, content, category, isPinned });
        } else {
            updateNote(parseInt(id), { title, content, category, isPinned });
        }
        navigate('/');
    };

    const updateState = (setter, value) => {
        setter(value);
        setSaving(true);
    };

    const handleTyping = (e) => {
        updateState(setContent, e.target.value);
        setIsSidebarCollapsed(true);
    };

    const getFontFamilyClass = () => {
        switch (fontFamily) {
            case 'serif': return 'font-serif';
            case 'mono': return 'font-mono';
            default: return 'font-sans';
        }
    };

    return (
        <div className="flex h-screen bg-transparent overflow-hidden relative">
            <div className="flex-1 flex flex-col w-full">
                <AnimatePresence>
                    {!isZenMode && (
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-16 border-b border-white/20 flex items-center justify-between px-6 bg-white/10 backdrop-blur-md z-10"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-700"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                {saving ? (
                                    <span className="text-gray-500 text-sm animate-pulse">Saving...</span>
                                ) : (
                                    <span className="text-gray-400 text-sm">Saved</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsZenMode(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Focus Mode"
                                >
                                    <Maximize2 size={20} />
                                </button>

                                <button
                                    onClick={() => updateState(setIsPinned, !isPinned)}
                                    className={`p-2 rounded-lg transition-colors ${isPinned
                                        ? 'bg-purple-100 text-gta-purple'
                                        : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Pin size={20} className={isPinned ? "fill-current" : ""} />
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F0F0F3] text-gta-purple rounded-lg font-medium hover:text-gta-pink transition-colors shadow-neumorphic-btn"
                                >
                                    <Save size={18} />
                                    <span>Save & Close</span>
                                </button>
                            </div>
                        </motion.header>
                    )}
                </AnimatePresence>

                <main className="flex-1 overflow-y-auto p-8 md:p-12" onClick={() => setIsSidebarCollapsed(true)}>
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Note Title"
                                value={title}
                                onChange={(e) => updateState(setTitle, e.target.value)}
                                className={`w-full text-4xl md:text-5xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 text-text mb-4 p-0 ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
                            />
                            <div className={`flex items-center gap-2 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-gray-400 text-sm font-medium">Category:</span>
                                <input
                                    type="text"
                                    list="categories"
                                    value={category}
                                    onChange={(e) => updateState(setCategory, e.target.value)}
                                    placeholder="Uncategorized"
                                    className="bg-white/40 border-none rounded-lg px-2 py-1 text-sm text-gray-600 placeholder-gray-400 focus:ring-1 focus:ring-gta-purple w-40"
                                />
                                <datalist id="categories">
                                    {existingCategories.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        <textarea
                            placeholder="Start writing..."
                            value={content}
                            onChange={handleTyping}
                            className={`w-full h-[calc(100vh-300px)] resize-none bg-transparent border-none focus:ring-0 text-lg text-gray-600 leading-relaxed p-0 ${getFontFamilyClass()} ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
                        />
                    </div>
                </main>
            </div >

            {/* Zen Mode Exit Button */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setIsZenMode(false)}
                        className="fixed bottom-8 right-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-gray-500 hover:bg-white/20 hover:text-gray-800 shadow-lg z-50 transition-colors"
                        title="Exit Focus"
                    >
                        <Minimize2 size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {!isZenMode && (
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    fontFamily={fontFamily}
                    setFontFamily={setFontFamily}
                    textAlign={textAlign}
                    setTextAlign={setTextAlign}
                    onInsertText={(text) => updateState(setContent, (prev) => prev + text)}
                />
            )}
        </div >
    );
}
