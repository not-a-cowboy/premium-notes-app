import { useRef, useState, useEffect } from 'react';
import { Save, Eraser, RotateCcw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DrawingCanvasProps {
    initialData?: string;
    onSave: (data: string) => void;
    onCancel: () => void;
}

export function DrawingCanvas({ initialData, onSave, onCancel }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(2);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    // History for Undo
    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(0);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Set dimensions
        canvas.width = container.clientWidth;
        canvas.height = 400; // Fixed height

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;

        // Load initial data
        if (initialData) {
            const img = new Image();
            img.src = initialData;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                saveHistory();
            };
        } else {
            // White background default (optional, but good for saving)
            // context.fillStyle = "white";
            // context.fillRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        }
    }, []);

    // Update Context on Tool Change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = brushSize;
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    }, [color, brushSize, tool]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.closePath();
            saveHistory();
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        let clientX, clientY;
        if ('touches' in e) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Slice history if we undid before drawing
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(canvas.toDataURL());
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = history[newStep];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveHistory();
    };

    const handleSave = () => {
        if (canvasRef.current) {
            onSave(canvasRef.current.toDataURL());
        }
    };

    const colors = [
        "#000000", "#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6",
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-200"
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); setTool('pen'); }}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === 'pen' ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                    <div className="w-px h-8 bg-gray-200 mx-2" />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-24 accent-gray-900"
                        title="Brush Size"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTool('eraser')}
                        className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-gray-200 text-black' : 'hover:bg-gray-100 text-gray-600'}`}
                        title="Eraser"
                    >
                        <Eraser size={20} />
                    </button>
                    <button onClick={handleUndo} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Undo" disabled={historyStep === 0}>
                        <RotateCcw size={20} className={historyStep === 0 ? "opacity-30" : ""} />
                    </button>
                    <button onClick={handleClear} className="p-2 hover:bg-gray-100 rounded-lg text-red-500" title="Clear All">
                        <Trash2 size={20} />
                    </button>
                    <div className="w-px h-8 bg-gray-200 mx-2" />
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gta-purple text-white rounded-lg font-medium text-sm hover:bg-gta-pink transition-colors shadow-lg shadow-purple-500/30 flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Sketch
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div ref={containerRef} className="border border-gray-100 rounded-xl overflow-hidden shadow-inner bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] h-[400px] relative touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 cursor-crosshair"
                />
            </div>
        </motion.div>
    );
}
