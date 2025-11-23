import { AnimatePresence, Reorder } from 'framer-motion';
import { NoteCard } from './NoteCard';

export function NoteGrid({ notes, onDelete, onNoteClick, onReorder }) {
    return (
        <Reorder.Group
            values={notes}
            onReorder={onReorder}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 auto-rows-auto list-none"
        >
            <AnimatePresence mode='popLayout'>
                {notes.map((note) => (
                    <Reorder.Item
                        key={note.id}
                        value={note}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        drag
                        dragMomentum={false}
                        dragElastic={0.1}
                        whileDrag={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", zIndex: 50, cursor: "grabbing" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="cursor-grab active:cursor-grabbing relative"
                    >
                        <NoteCard
                            note={note}
                            onDelete={onDelete}
                            onClick={() => onNoteClick(note)}
                        />
                    </Reorder.Item>
                ))}
            </AnimatePresence>
        </Reorder.Group>
    );
}
