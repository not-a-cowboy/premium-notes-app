import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function AddNoteButton({ onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-8 right-8 bg-text text-white p-4 rounded-full shadow-lifted z-50 flex items-center justify-center"
        >
            <Plus size={24} />
        </motion.button>
    );
}
