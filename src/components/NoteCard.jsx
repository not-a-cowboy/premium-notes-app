import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Check } from 'lucide-react';

export function NoteCard({ note, onDelete, onClick }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (isDeleting) {
            onDelete(note.id);
        } else {
            setIsDeleting(true);
            setTimeout(() => setIsDeleting(false), 3000); // Reset after 3s
        }
    };

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02, boxShadow: "9px 9px 16px rgba(163,177,198,0.3), -9px -9px 16px rgba(255,255,255, 0.3)" }}
            whileTap={{ scale: 0.98, boxShadow: "inset 6px 6px 10px 0 rgba(163,177,198, 0.3), inset -6px -6px 10px 0 rgba(255,255,255, 0.4)" }}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 relative group flex flex-col h-full cursor-pointer transition-all duration-300"
        >
            <button
                onClick={handleDelete}
                className={`absolute top-4 right-4 transition-all duration-300 flex items-center gap-1 px-2 py-1 rounded-full ${isDeleting
                    ? 'opacity-100 bg-red-500 text-white'
                    : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
            >
                {isDeleting ? <Check size={14} /> : <X size={18} />}
                {isDeleting && <span className="text-xs font-bold">Confirm</span>}
            </button>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{note.title}</h3>
            <p className="text-gray-600 flex-grow whitespace-pre-wrap">{note.content}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">{note.date}</span>
                {note.category && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 text-gray-500 border border-white/60">
                        {note.category}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
