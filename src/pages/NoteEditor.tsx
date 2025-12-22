import { useState, useEffect, useRef, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { Sidebar } from '../components/Sidebar';
import { AIAssistant } from '../components/AIAssistant';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { DrawingCanvas } from '../components/DrawingCanvas';

import { ArrowLeft, Maximize2, Minimize2, PenTool, Save, Terminal } from 'lucide-react';
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
    const [isPinned] = useState(foundNote?.isPinned || false);
    const [isNew, setIsNew] = useState(!foundNote);
    const [saving, setSaving] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isSketching, setIsSketching] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [fontFamily, setFontFamily] = useState('sans');
    const [textAlign, setTextAlign] = useState('left');

    const [lastLoadedId, setLastLoadedId] = useState<number | null>(null);

    const isLoaded = useRef(false);

    // Sync state when note data is loaded
    useEffect(() => {
        if (foundNote && foundNote.id !== lastLoadedId) {
            isLoaded.current = false;

            setTitle(foundNote.title);
            setContent(foundNote.content);
            setCategory(foundNote.category || 'Uncategorized');
            setLastLoadedId(foundNote.id);

            setTimeout(() => {
                isLoaded.current = true;
            }, 100);
        } else if (!foundNote && !id) {
            if (!isLoaded.current) {
                isLoaded.current = true;
            }
        }
    }, [foundNote, lastLoadedId, id]);

    useEffect(() => {
        if (!isLoaded.current) return;
        if (isNew && !title.trim() && !content.trim()) return;

        const timeoutId = setTimeout(() => {
            if (isNew) {
                const newId = Date.now();
                addNote({ id: newId, title, content, category, isPinned });
                setIsNew(false);
                navigate(`/note/${newId}`, { replace: true });
            } else if (id) {
                updateNote(parseInt(id), { title, content, category, isPinned });
            }
            setSaving(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, content, category, isPinned, id, isNew, addNote, updateNote, navigate]);

    const updateState = <T,>(setter: Dispatch<SetStateAction<T>>, value: T | ((prev: T) => T)) => {
        setter(value);
        setSaving(true);
    };

    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
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

    // AI Assistant Handlers
    const handleSummarize = async (summary: string) => {
        const newContent = `> **Summary**\n> ${summary}\n\n${content}`;
        updateState(setContent, newContent);
    };

    const handleTags = async (newTags: string[]) => {
        if (id) {
            await updateNote(Number(id), { tags: newTags });
        }
    };

    const handleGrammar = async (fixed: string) => {
        updateState(setContent, fixed);
    };

    const handleSaveSketch = async (data: string) => {
        if (id) {
            await updateNote(Number(id), { sketchData: data });
            setIsSketching(false);
        } else {
            alert("Please save the note (add title/content) before sketching.");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        if (isNew) {
            if (!title.trim() && !content.trim()) {
                setSaving(false);
                return;
            }
            const newId = Date.now();
            await addNote({ id: newId, title, content, category, isPinned });
            setIsNew(false);
            navigate(`/note/${newId}`, { replace: true });
        } else if (id) {
            await updateNote(parseInt(id), { title, content, category, isPinned });
        }
        setSaving(false);
    };

    return (
        <div className={`flex h-screen overflow-hidden relative transition-all duration-500 ease-in-out ${isZenMode ? 'bg-m-black' : 'bg-transparent'}`}>
            <div className="flex-1 flex flex-col w-full relative z-10">
                <AnimatePresence>
                    {!isZenMode && (
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-16 border-b-2 border-m-gray flex items-center justify-between px-6 bg-m-dark z-20 shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="p-2 hover:bg-m-white hover:text-black rounded-none transition-colors text-m-white border border-transparent hover:border-m-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                {saving ? (
                                    <span className="text-m-yellow text-xs font-technical uppercase animate-pulse">Saving_Data...</span>
                                ) : (
                                    <span className="text-gray-500 text-xs font-technical uppercase">System_Synced</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <AIAssistant
                                    content={content}
                                    onSummarize={handleSummarize}
                                    onTags={handleTags}
                                    onGrammar={handleGrammar}
                                />

                                <VoiceRecorder onRecordingComplete={(blob, transcript) => {
                                    if (transcript) {
                                        const newContent = content + (content ? '\n\n' : '') + `> 🎙️ **Voice Note:** ${transcript}`;
                                        updateState(setContent, newContent);
                                    }
                                    if (id && blob) {
                                        const currentNote = notes.find(n => n.id === Number(id));
                                        const currentRecordings = currentNote?.audioRecordings || [];
                                        updateNote(Number(id), { audioRecordings: [...currentRecordings, blob] });
                                    }
                                }} />

                                <button
                                    onClick={() => setIsSketching(true)}
                                    className="p-2 hover:bg-m-blue hover:text-black rounded-sm text-gray-400 transition-colors"
                                    title="Sketch"
                                >
                                    <PenTool size={20} />
                                </button>

                                <button
                                    onClick={() => setIsZenMode(true)}
                                    className="p-2 hover:bg-m-white hover:text-black rounded-sm text-gray-400 transition-colors"
                                    title="Focus Mode"
                                >
                                    <Maximize2 size={20} />
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="p-2 hover:bg-m-yellow hover:text-black rounded-sm text-gray-400 transition-colors"
                                    title="Save Note"
                                >
                                    <Save size={20} />
                                </button>
                            </div>
                        </motion.header>
                    )}
                </AnimatePresence>

                <main className="flex-1 overflow-y-auto p-8 md:p-12 relative" onClick={() => setIsSidebarCollapsed(true)}>
                    {/* Editor Background Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                            backgroundSize: "100% 2rem"
                        }}
                    />

                    <div className="max-w-3xl mx-auto relative z-10">
                        {/* Technical Meta Header */}
                        <div className="flex items-center gap-4 mb-2 font-technical text-xs text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                            <span>ID: {id || 'NEW_RECORD'}</span>
                            <span>//</span>
                            <span className="text-m-yellow">{isZenMode ? 'MODE: TERMINAL' : 'MODE: STANDARD'}</span>
                        </div>

                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="ENTER_TITLE..."
                                value={title}
                                onChange={(e) => updateState(setTitle, e.target.value)}
                                className={`w-full text-4xl md:text-5xl font-black uppercase tracking-tight bg-transparent border-none focus:ring-0 placeholder-gray-700 text-m-white mb-4 p-0 ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
                            />
                            <div className={`flex items-center gap-2 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-m-blue text-xs font-bold uppercase tracking-wider px-2 py-1 bg-m-blue/10 border border-m-blue/30">Category:</span>
                                <input
                                    type="text"
                                    list="categories"
                                    value={category}
                                    onChange={(e) => updateState(setCategory, e.target.value)}
                                    placeholder="Uncategorized"
                                    className="bg-transparent border-b border-gray-700 focus:border-m-blue rounded-none px-2 py-1 text-sm text-gray-300 placeholder-gray-600 focus:ring-0 w-40 font-mono transition-colors"
                                />
                                <datalist id="categories">
                                    {existingCategories.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        <textarea
                            placeholder="Initialize content stream..."
                            value={content}
                            onChange={handleTyping}
                            className={`w-full h-[calc(100vh-300px)] resize-none bg-transparent border-none focus:ring-0 text-lg text-gray-300 leading-relaxed p-0 ${getFontFamilyClass()} ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'} scrollbar-hide`}
                        />
                    </div>
                </main>
            </div >

            {/* Zen Mode Exit Button - Floating Tech Element */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => setIsZenMode(false)}
                        className="fixed top-8 right-8 p-4 bg-m-black border-2 border-m-red text-m-red hover:bg-m-red hover:text-black transition-all z-50 group"
                        title="TERMINATE_ZEN"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <Minimize2 size={24} />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block">Exit</span>
                        </div>
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

            <AnimatePresence>
                {isSketching && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-m-black/95 backdrop-blur-xl">
                        <div className="w-full max-w-4xl border-2 border-m-white p-1">
                            <DrawingCanvas
                                initialData={foundNote?.sketchData}
                                onSave={handleSaveSketch}
                                onCancel={() => setIsSketching(false)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
