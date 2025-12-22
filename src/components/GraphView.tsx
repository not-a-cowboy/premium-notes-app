import { useMemo, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';

interface GraphViewProps {
    notes: Note[];
}

export function GraphView({ notes }: GraphViewProps) {
    const navigate = useNavigate();
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        function handleResize() {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const data = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const tagMap = new Map<string, string>(); // Tag Name -> Tag Node ID

        // 1. Create Note Nodes
        notes.forEach(note => {
            nodes.push({
                id: `note-${note.id}`,
                name: note.title || 'NULL_NODE',
                val: 1, // Size
                type: 'note',
                color: '#CCFF00' // m-yellow
            });

            // 2. Process Tags for Links
            if (note.tags) {
                note.tags.forEach(tag => {
                    if (!tagMap.has(tag)) {
                        const tagId = `tag-${tag}`;
                        tagMap.set(tag, tagId);
                        // Create Tag Node
                        nodes.push({
                            id: tagId,
                            name: `[${tag}]`,
                            val: 0.5,
                            type: 'tag',
                            color: '#00F0FF' // m-blue
                        });
                    }
                    // Link Note -> Tag
                    links.push({
                        source: `note-${note.id}`,
                        target: tagMap.get(tag),
                        color: 'rgba(255, 255, 255, 0.1)'
                    });
                });
            }

            // 3. Process WikiLinks (Simple regex for [[Title]])
            const content = note.content || '';
            const wikiLinkRegex = /\[\[(.*?)\]\]/g;
            let match;
            while ((match = wikiLinkRegex.exec(content)) !== null) {
                const targetTitle = match[1];
                const targetNote = notes.find(n => n.title.toLowerCase() === targetTitle.toLowerCase());
                if (targetNote) {
                    links.push({
                        source: `note-${note.id}`,
                        target: `note-${targetNote.id}`,
                        color: 'rgba(204, 255, 0, 0.4)' // m-yellow link
                    });
                }
            }
        });

        return { nodes, links };
    }, [notes]);

    return (
        <div className="fixed inset-0 bg-[#050505] z-50 overflow-hidden">
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]" />

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 px-6 py-2 bg-m-black border border-m-gray text-m-white hover:border-m-red hover:text-m-red transition-all font-mono uppercase tracking-widest text-xs"
            >
                &lt; ABORT_VIEW
            </button>

            <div className="absolute top-6 right-6 z-50 pointer-events-none text-right">
                <h1 className="text-xl font-black uppercase text-m-white tracking-tighter">NEURAL_NET // VISUALIZER</h1>
                <p className="text-[10px] text-m-blue font-mono">ACTIVE_NODES: {notes.length}</p>
            </div>

            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeLabel="name"
                nodeRelSize={6}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onNodeClick={(node: any) => {
                    if (node.type === 'note') {
                        const noteId = node.id.replace('note-', '');
                        navigate(`/note/${noteId}`);
                    }
                }}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `bold ${fontSize}px Space Mono, monospace`;

                    ctx.beginPath();
                    if (node.type === 'note') {
                        // Square for notes
                        ctx.fillStyle = node.color;
                        const size = node.val * 4;
                        ctx.rect(node.x - size, node.y - size, size * 2, size * 2);
                        ctx.fill();

                        // Border
                        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
                        ctx.lineWidth = 1 / globalScale;
                        ctx.stroke();

                    } else {
                        // Diamond for tags
                        ctx.fillStyle = node.color;
                        const size = node.val * 3;
                        ctx.moveTo(node.x, node.y - size);
                        ctx.lineTo(node.x + size, node.y);
                        ctx.lineTo(node.x, node.y + size);
                        ctx.lineTo(node.x - size, node.y);
                        ctx.fill();
                    }

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = node.type === 'note' ? '#E5E5E5' : '#00F0FF';
                    ctx.fillText(label, node.x, node.y + (node.val * 5));
                }}
                linkColor={() => '#333'}
            />
        </div>
    );
}
