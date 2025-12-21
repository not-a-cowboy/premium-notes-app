import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check, Pin } from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
    note: Note;
    onDelete: (id: number) => void;
    onTogglePin: (id: number) => void;
    onClick: () => void;
}

export function NoteCard({ note, onDelete, onTogglePin, onClick }: NoteCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDeleting) {
            onDelete(note.id);
        } else {
            setIsDeleting(true);
            setTimeout(() => setIsDeleting(false), 2000);
        }
    };

    const handlePin = (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin(note.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={onClick}
            className={`
                relative group rounded-3xl p-6 cursor-pointer overflow-hidden
                backdrop-blur-md border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300
                flex flex-col h-64
                ${note.isPinned ? 'bg-purple-50/80 border-purple-200' : 'bg-white/60'}
            `}
        >
            {/* Pin Badge */}
            {note.isPinned && (
                <div className="absolute top-4 right-4 text-gta-purple transform rotate-45">
                    <Pin size={18} fill="currentColor" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{note.title || 'Untitled'}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 font-medium">
                    {note.content || 'No content'}
                </p>
            </div>

            {/* Footer / Actions */}
            <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{note.category}</span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePin}
                        className={`p-2 rounded-full hover:bg-white/50 transition-colors ${note.isPinned ? 'text-gta-purple' : 'text-gray-400'}`}
                        title={note.isPinned ? "Unpin" : "Pin"}
                    >
                        <Pin size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`p-2 rounded-full hover:bg-red-50 transition-colors ${isDeleting ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-500'}`}
                        title="Delete"
                    >
                        {isDeleting ? <Check size={16} /> : <Trash2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Overlay (Optional visual cue) */}
            {isDeleting && (
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className="absolute bottom-0 left-0 h-1 bg-red-500/50"
                />
            )}
        </motion.div>
    );
}
