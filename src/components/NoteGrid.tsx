import { NoteCard } from './NoteCard';
import { useState, useEffect } from 'react';
import { Note } from '../types';
import { PinPrompt } from './PinPrompt';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EncryptionService } from '../services/encryption';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface NoteGridProps {
    notes: Note[];
    onNoteClick: (note: Note) => void;
    onDeleteNote: (id: number) => void;
    onTogglePin: (id: number) => void;
    onReorderNotes?: (newOrder: Note[]) => void;
}

export function NoteGrid({ notes, onNoteClick, onDeleteNote, onTogglePin, onReorderNotes }: NoteGridProps) {
    const navigate = useNavigate();
    const [isPinPromptOpen, setIsPinPromptOpen] = useState(false);
    const [selectedLockedNote, setSelectedLockedNote] = useState<Note | null>(null);
    const [numColumns, setNumColumns] = useState(1);

    // Responsive Column Calculation
    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width >= 1280) setNumColumns(4); // xl
            else if (width >= 1024) setNumColumns(3); // lg
            else if (width >= 768) setNumColumns(2); // md
            else setNumColumns(1);
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const handleNoteInteraction = (note: Note) => {
        if (note.isLocked) {
            setSelectedLockedNote(note);
            setIsPinPromptOpen(true);
        } else {
            onNoteClick(note);
        }
    };

    const handleUnlock = (pin: string) => {
        if (!selectedLockedNote) return;
        const decrypted = EncryptionService.decrypt(selectedLockedNote.content, pin);

        if (decrypted !== null) {
            setIsPinPromptOpen(false);
            navigate(`/note/${selectedLockedNote.id}`, { state: { encryptionKey: pin } });
            setSelectedLockedNote(null);
        } else {
            alert('INCORRECT PIN');
        }
    };

    // Distribute notes into columns (Round Robin)
    const columns: Note[][] = Array.from({ length: numColumns }, () => []);
    notes.forEach((note, index) => {
        columns[index % numColumns].push(note);
    });

    const onDragEnd = (result: DropResult) => {
        if (!result.destination || !onReorderNotes) return;

        const { source, destination } = result;
        const sourceColIndex = Number(source.droppableId.split('-')[1]);
        const destColIndex = Number(destination.droppableId.split('-')[1]);

        // Calculate simplified global indices (approximation for intuitive reordering)
        // Since actual round-robin precise reordering is complex to visualize and map 1:1 with DnD standard logic,
        // we use a strategy: Remove from old list, Insert into new list at estimated position.

        // Actually, to maintain strict Round-Robin stability it is better to treat the list as one.
        // But dragging between columns in Masonry changes the visual position drastically.
        // Strategy:
        // 1. Construct the hypothetical new linear list.
        // 2. Remove item from its original index in linear list found via ID.
        // 3. Calculate target index?
        //    Target is tricky. Dropping at "Index 1" in "Col 2" means what global index?
        //    It's roughly: (destination.index * numColumns) + destColIndex.

        const newNotes = Array.from(notes);
        const sourceNoteId = Number(result.draggableId);
        const movedNoteIndex = newNotes.findIndex(n => n.id === sourceNoteId);

        if (movedNoteIndex === -1) return;
        const [movedNote] = newNotes.splice(movedNoteIndex, 1);

        // Estimate new index
        // If we drop at index K in Col C, it basically means we want it to be the K-th item of that column.
        // In valid round robin, that slot is roughly index: (K * numColumns) + C.
        let newIndex = (destination.index * numColumns) + destColIndex;

        // Clamp
        if (newIndex > newNotes.length) newIndex = newNotes.length;
        if (newIndex < 0) newIndex = 0;

        newNotes.splice(newIndex, 0, movedNote);

        onReorderNotes(newNotes);
    };

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-xl font-medium">No notes found</p>
                <p className="text-sm">Create one to get started!</p>
            </div>
        );
    }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 w-full items-start">
                    {columns.map((colNotes, colIndex) => (
                        <Droppable key={colIndex} droppableId={`col-${colIndex}`}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex-1 flex flex-col gap-6"
                                >
                                    {colNotes.map((note, index) => (
                                        <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="w-full"
                                                >
                                                    {note.isLocked ? (
                                                        <motion.div
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            whileHover={{ y: -5 }}
                                                            onClick={() => handleNoteInteraction(note)}
                                                            className={`
                                                                relative group cursor-pointer 
                                                                flex flex-col min-h-[160px] h-auto
                                                                border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--text-primary)]
                                                                transition-all duration-300
                                                                items-center justify-center p-6
                                                            `}
                                                        >
                                                            <Lock size={32} className="text-[var(--text-muted)] mb-3" />
                                                            <h3 className="text-sm font-bold uppercase font-display tracking-tight text-[var(--text-muted)] text-center">
                                                                LOCKED
                                                            </h3>
                                                            <p className="text-[9px] font-mono text-[var(--accent-secondary)] mt-1 uppercase tracking-widest">
                                                                ID_{note.id.toString().slice(-4)}
                                                            </p>
                                                        </motion.div>
                                                    ) : (
                                                        <NoteCard
                                                            note={note}
                                                            onClick={() => handleNoteInteraction(note)}
                                                            onDelete={onDeleteNote}
                                                            onTogglePin={onTogglePin}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <PinPrompt
                isOpen={isPinPromptOpen}
                onClose={() => setIsPinPromptOpen(false)}
                onSuccess={handleUnlock}
                mode="unlock"
                title="Access Denied"
            />
        </>
    );
}
