import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { ArrowLeft, GripHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export function KanbanBoard() {
    const { notes, updateNote } = useNotes();
    const [columns, setColumns] = useState<{ [key: string]: Note[] }>({});

    // Group notes by category
    useEffect(() => {
        const grouped: { [key: string]: Note[] } = {};

        const allCategories = new Set(notes.map(n => n.category || 'Uncategorized'));
        if (!allCategories.has('Uncategorized')) allCategories.add('Uncategorized');

        allCategories.forEach(cat => grouped[cat] = []);

        notes.forEach(note => {
            const cat = note.category || 'Uncategorized';
            if (!grouped[cat]) grouped[cat] = [];
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

        const newCategory = destination.droppableId;
        const noteId = Number(draggableId);
        updateNote(noteId, { category: newCategory });
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col font-mono text-m-white">
            {/* Header */}
            <div className="p-4 border-b-2 border-m-gray bg-m-dark sticky top-0 z-10 flex items-center gap-4 shadow-lg">
                <Link to="/" className="p-2 hover:bg-m-white hover:text-black transition-colors rounded-none border border-transparent hover:border-m-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-m-white">TASK_MATRIX // KANBAN</h1>
                    <p className="text-[10px] text-m-yellow uppercase tracking-widest">ORGANIZE_DATA_STREAMS</p>
                </div>
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
                                        className={`w-80 flex flex-col border border-m-gray/50 transition-colors ${snapshot.isDraggingOver ? 'bg-m-gray/20 border-m-yellow' : 'bg-m-black/40'
                                            }`}
                                    >
                                        {/* Column Header */}
                                        <div className="p-3 border-b border-m-gray/50 flex justify-between items-center bg-m-dark/80">
                                            <span className="font-bold uppercase tracking-widest text-xs text-m-blue">{columnId}</span>
                                            <span className="bg-m-blue/10 border border-m-blue/30 text-m-blue text-[10px] px-2 py-0.5 font-mono">
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
                                                            {/* Card */}
                                                            <div className="group bg-m-black p-4 border border-m-gray hover:border-m-white transition-all cursor-grab active:cursor-grabbing relative overflow-hidden">
                                                                {/* Decorative Corner */}
                                                                <div className="absolute top-0 right-0 w-2 h-2 bg-m-yellow opacity-0 group-hover:opacity-100 transition-opacity" />

                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="text-[9px] text-gray-500 font-mono">ID_{note.id}</span>
                                                                    <GripHorizontal size={12} className="text-gray-600 group-hover:text-m-yellow" />
                                                                </div>

                                                                <h4 className="font-bold text-sm uppercase mb-1 line-clamp-2 text-m-white group-hover:text-m-yellow transition-colors">{note.title || "NULL_TITLE"}</h4>
                                                                <p className="text-gray-500 text-[10px] line-clamp-3 mb-2 font-mono leading-relaxed">{note.content || "NO_DATA"}</p>

                                                                {note.tags && note.tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-800">
                                                                        {note.tags.slice(0, 2).map((tag, i) => (
                                                                            <span key={i} className="text-[9px] border border-gray-700 text-gray-400 px-1.5 py-0.5 uppercase">#{tag}</span>
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
