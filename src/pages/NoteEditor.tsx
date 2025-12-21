import { useState, useEffect, useRef, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { Sidebar } from '../components/Sidebar';
import { AIAssistant } from '../components/AIAssistant';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { DrawingCanvas } from '../components/DrawingCanvas';

import { ArrowLeft, Maximize2, Minimize2, PenTool } from 'lucide-react';
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
            // For new notes, we might need to store it in local state or force create?
            // Let's force create if it's a new note, similar to other interactions? 
            // Or just alert user to save first.
            // For now, simpler: alert.
            alert("Please save the note (add title/content) before sketching.");
        }
    };

    return (
        <div className={`flex h-screen overflow-hidden relative transition-all duration-500 ease-in-out ${isZenMode ? 'bg-[#FDFBF7]' : 'bg-transparent'}`}>
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
                                <AIAssistant
                                    content={content}
                                    onSummarize={handleSummarize}
                                    onTags={handleTags}
                                    onGrammar={handleGrammar}
                                />

                                <VoiceRecorder onRecordingComplete={(blob, transcript) => {
                                    // Append transcript
                                    if (transcript) {
                                        const newContent = content + (content ? '\n\n' : '') + `> 🎙️ **Voice Note:** ${transcript}`;
                                        updateState(setContent, newContent);
                                    }

                                    // Save audio blob (if we want to persist it)
                                    // For now, we'll just log it or maybe assume we'd upload it.
                                    // The user requirement said: "Save the blob to IndexedDB"
                                    if (id && blob) {
                                        // We need to fetch current note, append blob to array?
                                        // Just update note with new blob in array.
                                        // This requires reading current state or assuming we can push.
                                        // Since updateNote does a shallow merge, we might overwrite existing list if we don't handle it carefully.
                                        // Let's rely on the fact that if we had existing recordings, we'd need to load them.
                                        // For this MVP step, let's just create the array or append.
                                        // NOTE: Blob storage in IDB might be heavy if not careful, but IDB handles it.
                                        // Let's assume 'audioRecordings' is getting updated.
                                        // Ideally useNotes would expose a `addAudioRecording` method.
                                        // For now, let's skip complex Blob persistence logic in UI and just save transcript as requested feature priority 
                                        // BUT the prompt explicitly asked to "Save the blob to IndexedDB".
                                        // So I should try to save it. Only if ID exists.
                                        // We need the current note's audioRecordings to append to.
                                        // Let's access the note object from `notes` array in `useNotes` via `foundNote` logic or just `notes.find`.
                                        const currentNote = notes.find(n => n.id === Number(id));
                                        const currentRecordings = currentNote?.audioRecordings || [];
                                        updateNote(Number(id), { audioRecordings: [...currentRecordings, blob] });
                                    }
                                }} />

                                <button
                                    onClick={() => setIsSketching(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Sketch"
                                >
                                    <PenTool size={20} />
                                </button>

                                <button
                                    onClick={() => setIsZenMode(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Focus Mode"
                                >
                                    <Maximize2 size={20} />
                                </button>

                                {/* Removed Pin button */}
                                {/* Removed Save & Close button */}
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

            <AnimatePresence>
                {isSketching && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="w-full max-w-4xl">
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
