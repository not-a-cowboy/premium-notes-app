import { motion, AnimatePresence } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, Palette, List, Image, Upload, ChevronRight, Settings } from 'lucide-react';
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
    onOpenAnalytics: () => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, fontFamily, setFontFamily, textAlign, setTextAlign, onInsertText, onOpenAnalytics }: SidebarProps) {
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
                    className="fixed right-0 top-32 w-12 h-16 bg-[var(--sidebar-bg)] border-l-2 border-y-2 border-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-primary)] z-40 hover:w-16 transition-all"
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
                    className="fixed right-0 top-16 bottom-0 w-80 bg-[var(--sidebar-bg)] border-l-2 border-[var(--card-border)] z-40 flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--card-border)] flex justify-between items-center bg-black/20">
                        <h3 className="text-xl font-black uppercase text-[var(--text-primary)] tracking-tighter">Tools // Config</h3>
                        <button onClick={() => setIsCollapsed(true)} className="p-1 hover:bg-[var(--accent-secondary)] hover:text-white text-[var(--text-muted)] transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Typography */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-bold uppercase text-xs tracking-widest border-b border-[var(--card-border)] pb-2">
                                <Type size={14} />
                                <span>Typography_Set</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setFontFamily('sans')}
                                    className={`p-2 text-xs uppercase font-bold border transition-all ${fontFamily === 'sans' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'} `}
                                >
                                    Sans
                                </button>
                                <button
                                    onClick={() => setFontFamily('serif')}
                                    className={`p-2 text-xs uppercase font-bold border font-serif transition-all ${fontFamily === 'serif' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'} `}
                                >
                                    Serif
                                </button>
                                <button
                                    onClick={() => setFontFamily('mono')}
                                    className={`p-2 text-xs uppercase font-bold border font-mono transition-all ${fontFamily === 'mono' ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'} `}
                                >
                                    Mono
                                </button>
                            </div>
                        </div>

                        {/* Alignment */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-bold uppercase text-xs tracking-widest border-b border-[var(--card-border)] pb-2">
                                <span>Text_Align</span>
                            </div>
                            <div className="flex border border-[var(--card-border)] bg-transparent">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => setTextAlign(align)}
                                        className={`flex-1 p-2 flex justify-center transition-all border-r last:border-r-0 border-[var(--card-border)] ${textAlign === align ? 'bg-[var(--text-primary)] text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'} `}
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
                            <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-bold uppercase text-xs tracking-widest border-b border-[var(--card-border)] pb-2">
                                <Palette size={14} />
                                <span>Visual_Theme</span>
                            </div>
                            <ThemePicker />
                        </div>

                        {/* Insert Operations */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-bold uppercase text-xs tracking-widest border-b border-[var(--card-border)] pb-2">
                                <Upload size={14} />
                                <span>Data_Ingest</span>
                            </div>

                            <button
                                onClick={() => onInsertText('\n• ')}
                                className="w-full p-3 border border-[var(--card-border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all text-left flex items-center gap-3 text-[var(--text-muted)] group"
                            >
                                <List size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                                <span className="text-xs font-bold uppercase">Insert List Node</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-3 border border-[var(--card-border)] hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)] transition-all text-left flex items-center gap-3 text-[var(--text-muted)] group"
                            >
                                <Image size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-secondary)]" />
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

                        {/* Insights */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-bold uppercase text-xs tracking-widest border-b border-[var(--card-border)] pb-2">
                                <AlignLeft size={14} />
                                <span>Insights</span>
                            </div>
                            <button
                                onClick={onOpenAnalytics}
                                className="w-full p-3 border border-[var(--card-border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all text-left flex items-center gap-3 text-[var(--text-muted)] group"
                            >
                                <span className="text-xs font-bold uppercase">View Analytics</span>
                            </button>
                        </div>

                        {/* Decorative Footer */}
                        <div className="mt-auto pt-8 border-t border-[var(--card-border)] opacity-50">
                            <div className="h-4 w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,var(--card-border)_5px,var(--card-border)_10px)]" />
                            <p className="text-[10px] text-[var(--text-muted)] font-mono mt-2 text-center">SYS_READY</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
