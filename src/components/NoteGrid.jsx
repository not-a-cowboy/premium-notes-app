import { VirtuosoGrid } from 'react-virtuoso';
import { NoteCard } from './NoteCard';
import { forwardRef } from 'react';

// Custom List Component for the Grid Layout
const ListContainer = forwardRef(({ style, children, ...props }, ref) => (
    <div
        ref={ref}
        {...props}
        style={{ ...style, display: 'grid' }} // Virtuoso overwrites display, so we enforce grid here if needed, but usually class is enough if style doesn't conflict
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 pb-24" // Added bottom padding for scroll space
    >
        {children}
    </div>
));

// Custom Item Component to wrap each card
const ItemContainer = forwardRef(({ children, ...props }, ref) => (
    <div
        {...props}
        ref={ref}
        className="h-full min-h-[250px]" // Ensure items have height for calculation
    >
        {children}
    </div>
));

export function NoteGrid({ notes, onDelete, onNoteClick, onReorder, onTogglePin }) {
    if (!notes || notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <p>No notes found.</p>
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
            itemContent={(index, note) => (
                <div className="h-full">
                    <NoteCard
                        note={note}
                        onDelete={onDelete}
                        onClick={() => onNoteClick(note)}
                        onTogglePin={onTogglePin}
                    />
                </div>
            )}
        />
    );
}
