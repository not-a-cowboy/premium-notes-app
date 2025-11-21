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
    const [isNew, setIsNew] = useState(true);

    useEffect(() => {
        if (id) {
            const note = notes.find(n => n.id === parseInt(id));
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setIsNew(false);
            }
        }
    }, [id, notes]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (isNew) {
            addNote({ title, content });
        } else {
            updateNote(parseInt(id), { title, content });
        }
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-text text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-subtle"
                    >
                        <Save size={18} />
                        <span>Save</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        <input
                            type="text"
                            placeholder="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300 text-text mb-8 p-0"
                        />
                        <textarea
                            placeholder="Start writing..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[calc(100vh-300px)] resize-none bg-transparent border-none focus:ring-0 text-lg text-gray-600 leading-relaxed p-0"
                        />
                    </div>
                </main>
            </div>

            <Sidebar />
        </div>
    );
}
