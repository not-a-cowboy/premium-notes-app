import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NoteModal({ isOpen, onClose, onSave, note }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() && !content.trim()) return;

        onSave({ title, content });
        setTitle('');
        setContent('');
    };

    const handleExpand = () => {
        if (note) {
            navigate(`/note/${note.id}`);
        } else {
            // If creating a new note, just go to new note page
            navigate('/new');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-lifted p-6 md:p-8 z-10"
            >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                        onClick={handleExpand}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        title="Expand to full page"
                    >
                        <Maximize2 size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-text">{note ? 'Edit Note' : 'New Note'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xl font-semibold placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent text-text"
                            autoFocus={!note}
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Start typing..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            className="w-full resize-none text-gray-600 placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent leading-relaxed"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors mr-2 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() && !content.trim()}
                            className="px-6 py-2 bg-text text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
