import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function NoteCard({ note, onDelete }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-subtle border border-gray-100 relative group flex flex-col h-full"
        >
            <button
                onClick={() => onDelete(note.id)}
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
