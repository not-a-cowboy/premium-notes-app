export function NoteGrid({ notes, onDelete, onNoteClick, onReorder }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 auto-rows-auto list-none">
            {notes.map((note) => (
                <div key={note.id} className="relative">
                    <NoteCard
                        note={note}
                        onDelete={onDelete}
                        onClick={() => onNoteClick(note)}
                    />
                </div>
            ))}
        </div>
    );
}
