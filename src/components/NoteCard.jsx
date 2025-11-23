import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function NoteCard({ note, onDelete, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
            className="bg-white rounded-2xl p-6 shadow-subtle border border-gray-100 relative group flex flex-col h-full cursor-pointer"
        >
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            >
                <X size={18} />
            </button>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{note.title}</h3>
            <p className="text-gray-600 flex-grow whitespace-pre-wrap">{note.content}</p>
            <span className="text-xs text-gray-400 mt-4 block">{note.date}</span>
        </motion.div>
    );
}
