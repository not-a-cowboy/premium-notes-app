import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';

export function NoteEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, addNote, updateNote } = useNotes();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [isNew, setIsNew] = useState(true);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [fontFamily, setFontFamily] = useState('sans');
    const [textAlign, setTextAlign] = useState('left');

    // Derived categories for suggestions
    const existingCategories = [...new Set(notes.map(n => n.category))];

    useEffect(() => {
        if (id) {
            const note = notes.find(n => n.id === parseInt(id));
            if (note) {
                // Only update state if it differs significantly to avoid cursor jumps during autosave/navigation
                if (note.title !== title) setTitle(note.title);
                if (note.content !== content) setContent(note.content);
                if (note.category !== category) setCategory(note.category || 'Uncategorized');
                setIsNew(false);
            }
        }
    }, [id, notes]); // Removed local state deps to avoid circular overwrites, actually we need them to compare? No, just compare inside.

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Skip save if empty and new
        if (isNew && !title.trim() && !content.trim()) return;

        setSaving(true);
        const timeoutId = setTimeout(() => {
            if (isNew) {
                const newId = Date.now();
                // Create the note directly with all fields
                addNote({ id: newId, title, content, category });
                setIsNew(false);
                // Silently update URL to the new ID so refresh works
                navigate(`/note/${newId}`, { replace: true });
            } else {
                updateNote(parseInt(id), { title, content, category });
            }
            setSaving(false);
        }, 1000); // 1s debounce

        return () => clearTimeout(timeoutId);
    }, [title, content, category, id, isNew]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (isNew) {
            addNote({ title, content, category });
        } else {
            updateNote(parseInt(id), { title, content, category });
        }
        navigate('/');
    };

    const handleTyping = (e) => {
        setContent(e.target.value);
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
                <header className="h-16 border-b border-white/20 flex items-center justify-between px-6 bg-white/10 backdrop-blur-md z-10">
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

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F0F0F3] text-gta-purple rounded-lg font-medium hover:text-gta-pink transition-colors shadow-neumorphic-btn"
                    >
                        <Save size={18} />
                        <span>Save & Close</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 md:p-12" onClick={() => setIsSidebarCollapsed(true)}>
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Note Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full text-4xl md:text-5xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 text-text mb-4 p-0 ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
                            />
                            <div className={`flex items-center gap-2 ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-gray-400 text-sm font-medium">Category:</span>
                                <input
                                    type="text"
                                    list="categories"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
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
            </div>

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                textAlign={textAlign}
                setTextAlign={setTextAlign}
                onInsertText={(text) => setContent(prev => prev + text)}
            />
        </div>
    );
}
