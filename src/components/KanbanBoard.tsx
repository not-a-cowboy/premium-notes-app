import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function KanbanBoard() {
    const { notes, updateNote } = useNotes();
    const [columns, setColumns] = useState<{ [key: string]: Note[] }>({});

    // Group notes by category
    useEffect(() => {
        const grouped: { [key: string]: Note[] } = {};

        // Ensure we have at least these default columns if they exist in notes, or just dynamic
        // Let's go purely dynamic based on existing categories + "Uncategorized"
        const allCategories = new Set(notes.map(n => n.category || 'Uncategorized'));
        // Always ensure 'Uncategorized' and maybe 'To Do', 'Doing', 'Done' if we want defaults?
        // User request: "Dynamically generate columns based on unique Note.category"
        // Let's add 'Uncategorized' default if not present, and maybe sort them?
        if (!allCategories.has('Uncategorized')) allCategories.add('Uncategorized');

        // Initialize arrays
        allCategories.forEach(cat => grouped[cat] = []);

        // Fill arrays
        notes.forEach(note => {
            const cat = note.category || 'Uncategorized';
            if (!grouped[cat]) grouped[cat] = []; // Just in case
            grouped[cat].push(note);
        });

        setColumns(grouped);
    }, [notes]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // If dropped in same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Just update the category
        const newCategory = destination.droppableId;
        const noteId = Number(draggableId);

        // Optimistic UI update could be complex with the useEffect dependency.
        // We'll trust the DB update triggers a re-render via useNotes -> useEffect.
        // But for smoothness, we might want local state update?
        // Actually, if we update DB, useNotes re-fetches or updates state, causing this component to re-render.
        // Let's fire the update.
        updateNote(noteId, { category: newCategory });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white/80 backdrop-blur sticky top-0 z-10 flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">Board View</h1>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="h-full flex p-6 gap-6 min-w-max">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.keys(columns).sort().map(columnId => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`w-80 flex flex-col rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : 'bg-gray-100/50'
                                            }`}
                                    >
                                        <div className="p-4 font-bold text-gray-700 uppercase tracking-wider text-sm sticky top-0 bg-transparent flex justify-between items-center">
                                            {columnId}
                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                {columns[columnId].length}
                                            </span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                            {columns[columnId].map((note, index) => (
                                                <Draggable key={note.id} draggableId={note.id?.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.8 : 1
                                                            }}
                                                        >
                                                            {/* Minimal card content */}
                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{note.title || "Untitled"}</h4>
                                                                <p className="text-gray-500 text-xs line-clamp-3 mb-2">{note.content}</p>
                                                                {note.tags && note.tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {note.tags.slice(0, 2).map((tag, i) => (
                                                                            <span key={i} className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded">#{tag}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}
