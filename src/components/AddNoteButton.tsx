import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddNoteButtonProps {
    onClick: () => void;
}

export function AddNoteButton({ onClick }: AddNoteButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            aria-label="Add new note"
            className="group fixed bottom-8 right-8 w-16 h-16 bg-[var(--btn-add-bg)] border-2 border-[var(--btn-add-border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[var(--btn-add-icon)] z-40 transition-transform overflow-hidden"
            whileHover={{ scale: 1.05, x: -2, y: -2, boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
            whileTap={{ scale: 0.95, x: 0, y: 0, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
        >
            {/* Tech Crosshairs */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--btn-add-icon)]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--btn-add-icon)]" />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--btn-add-border)]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--btn-add-border)]" />

            <Plus size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
    );
}
