import { AnimatePresence, motion } from 'framer-motion';
import { NoteCard } from './NoteCard';

export function NoteGrid({ notes, onDelete }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 auto-rows-auto">
            <AnimatePresence mode='popLayout'>
                {notes.map((note, index) => (
                    <NoteCard key={note.id} note={note} onDelete={onDelete} />
                ))}
            </AnimatePresence>
        </div>
    );
}
