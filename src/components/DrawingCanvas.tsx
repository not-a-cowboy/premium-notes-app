import { useRef, useState, useEffect } from 'react';
import { Save, Eraser, RotateCcw, Trash2, X } from 'lucide-react';
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
    const [color, setColor] = useState("#CCFF00"); // m-yellow default
    const [brushSize, setBrushSize] = useState(2);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(0);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        canvas.width = container.clientWidth;
        canvas.height = 400;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;

        if (initialData) {
            const img = new Image();
            img.src = initialData;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                saveHistory();
            };
        } else {
            saveHistory();
        }
    }, []);

    // Update Context on Tool Change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = tool === 'eraser' ? '#050505' : color; // Eraser paints background color (m-black)
        ctx.lineWidth = brushSize;
        // With dark mode canvas, we usually want to paint "black" to erase if we don't have transparency layers
        // Or globalCompositeOperation 'destination-out' for true transparency
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
        "#FAFAFA", "#CCFF00", "#00F0FF", "#FF3300", "#FF2A2A", "#8B5CF6"
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-0 bg-m-black border border-m-gray w-full max-w-3xl shadow-2xl font-mono text-m-white"
        >
            {/* Header */}
            <div className="p-3 border-b border-m-gray flex justify-between items-center bg-m-dark/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-m-yellow">Schematic_Design_Tool</h3>
                <button onClick={onCancel} className="text-gray-500 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            {/* Toolbar */}
            <div className="p-3 bg-m-black border-b border-m-gray/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); setTool('pen'); }}
                            className={`w-6 h-6 border transition-all hover:scale-110 ${color === c && tool === 'pen' ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'border-gray-600'}`}
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                    <div className="w-px h-6 bg-gray-800 mx-1" />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-20 accent-m-yellow h-1 bg-gray-800 appearance-none rounded-none"
                        title="Stroke Width"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTool('eraser')}
                        className={`p-2 transition-colors border border-transparent ${tool === 'eraser' ? 'bg-m-white text-black' : 'hover:bg-gray-800 text-gray-400'}`}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>
                    <button onClick={handleUndo} className="p-2 hover:bg-gray-800 text-gray-400" title="Undo" disabled={historyStep === 0}>
                        <RotateCcw size={18} className={historyStep === 0 ? "opacity-30" : ""} />
                    </button>
                    <button onClick={handleClear} className="p-2 hover:bg-m-red hover:text-black text-m-red transition-colors ml-2" title="Clear All">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div ref={containerRef} className="bg-[#0A0A0A] h-[400px] relative touch-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:20px_20px] cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0"
                />
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-m-gray flex justify-end gap-3 bg-m-dark/50">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-m-yellow text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Save size={14} />
                    Save_Schematic
                </button>
            </div>
        </motion.div>
    );
}
