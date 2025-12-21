import { VirtuosoGrid } from 'react-virtuoso';
import { NoteCard } from './NoteCard';
import { forwardRef } from 'react';
import { Note } from '../types';

interface NoteGridProps {
    notes: Note[];
    onNoteClick: (note: Note) => void;
    onDeleteNote: (id: number) => void;
    onTogglePin: (id: number) => void;
}

// Custom List Component for the Grid Layout
const ListContainer = forwardRef<HTMLDivElement, any>(({ style, children, ...props }, ref) => (
    <div
        ref={ref}
        {...props}
        style={{
            ...style,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '1rem',
        }}
    >
        {children}
    </div>
));

// Custom Item Component to wrap the NoteCard
const ItemContainer = forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props} style={{ paddingBottom: '1rem' }}>
        {children}
    </div>
));


export function NoteGrid({ notes, onNoteClick, onDeleteNote, onTogglePin }: NoteGridProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-xl font-medium">No notes found</p>
                <p className="text-sm">Create one to get started!</p>
            </div>
        );
    }

    return (
        <VirtuosoGrid
            useWindowScroll
            data={notes}
            components={{
                List: ListContainer,
                Item: ItemContainer
            }}
            itemContent={(_, note) => (
                <NoteCard
                    note={note}
                    onClick={() => onNoteClick(note)}
                    onDelete={onDeleteNote}
                    onTogglePin={onTogglePin}
                />
            )}
        />
    );
}
