import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function AddNoteButton({ onClick }) {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-8 right-8 w-16 h-16 bg-[#F0F0F3] rounded-full shadow-neumorphic-btn flex items-center justify-center text-gta-purple hover:text-gta-pink transition-colors z-40"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9, boxShadow: "inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)" }}
        >
            <Plus size={24} />
        </motion.button>
    );
}
