import { motion, AnimatePresence } from 'framer-motion';
import { Type, List, Image, AlignLeft, AlignCenter, AlignRight, Pencil, Upload } from 'lucide-react';
import { useRef } from 'react';

export function Sidebar({ isCollapsed, setIsCollapsed, fontFamily, setFontFamily, textAlign, setTextAlign, onInsertText }) {
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            onInsertText('\n' + e.target.result);
        };
        reader.readAsText(file);
    };

    return (
        <AnimatePresence mode="wait">
            {isCollapsed ? (
                <motion.button
                    key="collapsed"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCollapsed(false)}
                    className="fixed right-8 top-24 w-12 h-12 bg-white/60 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center justify-center text-gray-700 z-50"
                >
                    <Pencil size={20} />
                </motion.button>
            ) : (
                <motion.div
                    key="expanded"
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-8 top-24 bottom-8 w-80 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-6 flex flex-col gap-6 z-50 overflow-y-auto"
                >
                    <h3 className="text-lg font-bold text-gray-900">Formatting</h3>

                    <div className="space-y-6">
                        {/* Typography */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Type size={18} />
                                <span>Typography</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setFontFamily('sans')}
                                    className={`p-2 rounded-lg text-sm border transition-all ${fontFamily === 'sans' ? 'bg-gta-purple text-white border-transparent' : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
                                >
                                    Sans
                                </button>
                                <button
                                    onClick={() => setFontFamily('serif')}
                                    className={`p-2 rounded-lg text-sm border font-serif transition-all ${fontFamily === 'serif' ? 'bg-gta-purple text-white border-transparent' : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
                                >
                                    Serif
                                </button>
                                <button
                                    onClick={() => setFontFamily('mono')}
                                    className={`p-2 rounded-lg text-sm border font-mono transition-all ${fontFamily === 'mono' ? 'bg-gta-purple text-white border-transparent' : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
                                >
                                    Mono
                                </button>
                            </div>
                        </div>

                        {/* Alignment */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <AlignLeft size={18} />
                                <span>Alignment</span>
                            </div>
                            <div className="flex gap-2 bg-white/40 p-1 rounded-xl border border-white/50">
                                <button
                                    onClick={() => setTextAlign('left')}
                                    className={`flex-1 p-2 rounded-lg flex items-center justify-center transition-all ${textAlign === 'left' ? 'bg-white shadow-sm text-gta-purple' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setTextAlign('center')}
                                    className={`flex-1 p-2 rounded-lg flex items-center justify-center transition-all ${textAlign === 'center' ? 'bg-white shadow-sm text-gta-purple' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignCenter size={18} />
                                </button>
                                <button
                                    onClick={() => setTextAlign('right')}
                                    className={`flex-1 p-2 rounded-lg flex items-center justify-center transition-all ${textAlign === 'right' ? 'bg-white shadow-sm text-gta-purple' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Lists */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <List size={18} />
                                <span>Lists</span>
                            </div>
                            <button
                                onClick={() => onInsertText('\n• ')}
                                className="w-full p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all text-left flex items-center gap-2 text-gray-700"
                            >
                                <List size={18} />
                                <span>Insert Bullet List</span>
                            </button>
                        </div>

                        {/* Media / Upload */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Image size={18} />
                                <span>Media</span>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all text-left flex items-center gap-2 text-gray-700"
                            >
                                <Upload size={18} />
                                <span>Upload Text File</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".txt,.md"
                                className="hidden"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
