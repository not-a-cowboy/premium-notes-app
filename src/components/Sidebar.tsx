import { motion, AnimatePresence } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, Palette, X, List, Image, Upload, ChevronRight, Settings } from 'lucide-react';
import { useRef, ChangeEvent } from 'react';
import { ThemePicker } from './ThemePicker';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    textAlign: string;
    setTextAlign: (align: string) => void;
    onInsertText: (text: string) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, fontFamily, setFontFamily, textAlign, setTextAlign, onInsertText }: SidebarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result;
            if (typeof result === 'string') {
                onInsertText('\n' + result);
            }
        };
        reader.readAsText(file);
    };

    return (
        <AnimatePresence mode="wait">
            {isCollapsed ? (
                <motion.button
                    key="collapsed"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    onClick={() => setIsCollapsed(false)}
                    className="fixed right-0 top-32 w-12 h-16 bg-m-dark border-l-2 border-y-2 border-m-yellow flex items-center justify-center text-m-yellow z-40 hover:w-16 transition-all"
                >
                    <Settings ref={(node) => {
                        if (node) {
                            node.style.setProperty("animation", "spin 10s linear infinite");
                        }
                    }} size={24} />
                </motion.button>
            ) : (
                <motion.div
                    key="expanded"
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-16 bottom-0 w-80 bg-m-black border-l-2 border-m-gray z-40 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-m-gray flex justify-between items-center bg-m-dark/50">
                        <h3 className="text-xl font-black uppercase text-white tracking-tighter">Tools // Config</h3>
                        <button onClick={() => setIsCollapsed(true)} className="p-1 hover:bg-m-red hover:text-white text-gray-400 transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Typography */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-m-blue font-bold uppercase text-xs tracking-widest border-b border-m-gray pb-2">
                                <Type size={14} />
                                <span>Typography_Set</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setFontFamily('sans')}
                                    className={`p-2 text-xs uppercase font-bold border transition-all ${fontFamily === 'sans' ? 'bg-m-yellow text-black border-m-yellow' : 'bg-transparent text-gray-400 border-m-gray hover:border-white hover:text-white'} `}
                                >
                                    Sans
                                </button>
                                <button
                                    onClick={() => setFontFamily('serif')}
                                    className={`p-2 text-xs uppercase font-bold border font-serif transition-all ${fontFamily === 'serif' ? 'bg-m-yellow text-black border-m-yellow' : 'bg-transparent text-gray-400 border-m-gray hover:border-white hover:text-white'} `}
                                >
                                    Serif
                                </button>
                                <button
                                    onClick={() => setFontFamily('mono')}
                                    className={`p-2 text-xs uppercase font-bold border font-mono transition-all ${fontFamily === 'mono' ? 'bg-m-yellow text-black border-m-yellow' : 'bg-transparent text-gray-400 border-m-gray hover:border-white hover:text-white'} `}
                                >
                                    Mono
                                </button>
                            </div>
                        </div>

                        {/* Alignment */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-m-blue font-bold uppercase text-xs tracking-widest border-b border-m-gray pb-2">
                                <span>Text_Align</span>
                            </div>
                            <div className="flex border border-m-gray bg-transparent">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => setTextAlign(align)}
                                        className={`flex-1 p-2 flex justify-center transition-all border-r last:border-r-0 border-m-gray ${textAlign === align ? 'bg-m-white text-black' : 'text-gray-500 hover:text-white'} `}
                                    >
                                        {align === 'left' && <AlignLeft size={18} />}
                                        {align === 'center' && <AlignCenter size={18} />}
                                        {align === 'right' && <AlignRight size={18} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Picker */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-m-blue font-bold uppercase text-xs tracking-widest border-b border-m-gray pb-2">
                                <Palette size={14} />
                                <span>Visual_Theme</span>
                            </div>
                            <ThemePicker />
                        </div>

                        {/* Insert Operations */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-m-blue font-bold uppercase text-xs tracking-widest border-b border-m-gray pb-2">
                                <Upload size={14} />
                                <span>Data_Ingest</span>
                            </div>

                            <button
                                onClick={() => onInsertText('\n• ')}
                                className="w-full p-3 border border-m-gray hover:border-m-yellow hover:text-m-yellow transition-all text-left flex items-center gap-3 text-gray-400 group"
                            >
                                <List size={16} className="text-gray-600 group-hover:text-m-yellow" />
                                <span className="text-xs font-bold uppercase">Insert List Node</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-3 border border-m-gray hover:border-m-blue hover:text-m-blue transition-all text-left flex items-center gap-3 text-gray-400 group"
                            >
                                <Image size={16} className="text-gray-600 group-hover:text-m-blue" />
                                <span className="text-xs font-bold uppercase">Import Text File</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".txt,.md"
                                className="hidden"
                            />
                        </div>

                        {/* Decorative Footer */}
                        <div className="mt-auto pt-8 border-t border-m-gray opacity-50">
                            <div className="h-4 w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#333_5px,#333_10px)]" />
                            <p className="text-[10px] text-gray-600 font-mono mt-2 text-center">SYS_READY</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
