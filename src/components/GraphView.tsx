import { useMemo, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { Note } from '../types';
// import { useTheme } from '../context/ThemeContext'; // Assuming we have theme context access or just use standard colors

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
                name: note.title || 'Untitled',
                val: 1, // Size
                type: 'note',
                color: '#8B5CF6' // GTA Purple
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
                            name: `#${tag}`,
                            val: 0.5,
                            type: 'tag',
                            color: '#F59E0B' // Amber/Yellow
                        });
                    }
                    // Link Note -> Tag
                    links.push({
                        source: `note-${note.id}`,
                        target: tagMap.get(tag),
                        color: 'rgba(0,0,0,0.1)'
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
                        color: 'rgba(139, 92, 246, 0.3)' // Purple link
                    });
                }
            }
        });

        return { nodes, links };
    }, [notes]);

    return (
        <div className="fixed inset-0 bg-[#F3F4F6] z-50">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 p-3 bg-white shadow-lg rounded-xl font-bold text-gray-700 hover:bg-gray-50 border border-gray-100 transition-all"
            >
                ← Back to Notes
            </button>

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
                    ctx.font = `${fontSize}px Sans-Serif`;
                    // const textWidth = ctx.measureText(label).width;
                    // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    if (node.type === 'tag') ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

                    ctx.beginPath();
                    // Draw circle/pill background
                    ctx.arc(node.x, node.y, node.val * 4, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.color;
                    ctx.fill();

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1f2937'; // gray-800
                    if (node.type === 'tag') {
                        ctx.fillStyle = '#78350f'; // amber-900
                        ctx.font = `italic ${fontSize}px Sans-Serif`;
                    }
                    ctx.fillText(label, node.x, node.y + (node.val * 4) + fontSize);
                }}
            />
        </div>
    );
}
