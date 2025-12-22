import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check, Pin, FileText, Activity } from 'lucide-react';
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={onClick}
            className={`
                relative group p-0 cursor-pointer 
                flex flex-col h-64
                ${note.isPinned
                    ? 'border-2 border-[var(--accent-primary)] bg-[var(--card-bg)]'
                    : 'border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--text-primary)]'
                }
                transition-all duration-300
            `}
        >
            {/* Chamfered visual hack (optional, or use clip-path on container) */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-m-yellow clip-polygon hidden" />

            {/* Header Strip */}
            <div className="flex justify-between items-center p-3 border-b border-[var(--card-border)] bg-black/20">
                <div className="flex items-center gap-2">
                    {note.isPinned ? <Pin size={12} className="text-[var(--accent-primary)]" /> : <Activity size={12} className="text-[var(--accent-secondary)]" />}
                    <span className="font-technical text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        ID_{note.id.toString().slice(-4)}
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full" />
                    <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full" />
                    <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-hidden relative">
                {/* Background Grid Pattern in card */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(var(--text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--text-secondary) 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                    }}
                />

                <h3 className={`text-xl font-bold uppercase mb-3 line-clamp-1 font-display tracking-tight ${note.isPinned ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {note.title || 'UNTITLED_RECORD'}
                </h3>

                <p className="text-[var(--text-secondary)] text-xs font-mono leading-relaxed line-clamp-5">
                    {note.content || 'NO_DATA_AVAILABLE...'}
                </p>
            </div>

            {/* Footer / Actions */}
            <div className="p-3 border-t border-[var(--card-border)] bg-black/20 flex items-center justify-between group-hover:bg-[var(--accent-primary)]/10 transition-colors">
                <span className="text-[10px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest border border-[var(--accent-secondary)]/30 px-2 py-0.5">
                    {note.category || 'NULL'}
                </span>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handlePin}
                        className={`p-1.5 hover:bg-[var(--text-primary)] hover:text-black transition-colors ${note.isPinned ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
                        title="TOGGLE_PIN"
                    >
                        <Pin size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`p-1.5 hover:bg-m-red hover:text-black transition-colors ${isDeleting ? 'text-m-red bg-white' : 'text-[var(--text-muted)]'}`}
                        title="PURGE_RECORD"
                    >
                        {isDeleting ? <Check size={14} /> : <Trash2 size={14} />}
                    </button>
                </div>
            </div>

            {/* Delete Progress Bar */}
            {isDeleting && (
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className="absolute bottom-0 left-0 h-1 bg-m-red"
                />
            )}
        </motion.div>
    );
}
